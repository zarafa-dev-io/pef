import type { ParsedAsset } from '../lib/assets.js';
import { downstreamIds, type AssetGraph } from '../lib/graph.js';
import type { Gap } from './coverage.js';

interface Section {
  title: string;
  types: string[];
}

// Ordre de lecture de l'inventaire : de la vision vers la preuve, puis la gouvernance.
const SECTIONS: Section[] = [
  { title: 'Vision', types: ['Vision'] },
  { title: 'Objectifs', types: ['Goal'] },
  { title: 'Roadmap', types: ['Roadmap'] },
  { title: 'Personas', types: ['Persona'] },
  { title: 'Backlog', types: ['WorkItem'] },
  { title: 'Exigences et règles', types: ['Requirement', 'BusinessRule', 'NonFunctionalRequirement'] },
  { title: 'Spécifications', types: ['Specification'] },
  { title: "Critères d'acceptation", types: ['AcceptanceCriteria'] },
  { title: 'Recette', types: ['TestPlan', 'TestCase'] },
  { title: 'Décisions', types: ['Decision'] },
  { title: 'Releases', types: ['Release'] },
  { title: 'Documentation', types: ['Documentation'] },
];

// Types restitués DANS un domaine fonctionnel (la stratégie et la gouvernance
// — Vision, Goals, Roadmap, Personas, Décisions, Releases — restent transverses).
const DOMAIN_TYPE_ORDER = [
  'UserStory', 'Bug', 'Requirement', 'BusinessRule', 'NonFunctionalRequirement',
  'Specification', 'AcceptanceCriteria', 'TestPlan', 'TestCase', 'Documentation',
] as const;

const PRIORITY_ORDER: Record<string, number> = { Must: 0, Should: 1, Could: 2, Wont: 3 };

const cell = (value: unknown): string => String(value ?? '—').replace(/\|/g, '\\|');

const byId = (a: ParsedAsset, b: ParsedAsset): number => {
  const [pa, na] = String(a.fm!.id).split('-');
  const [pb, nb] = String(b.fm!.id).split('-');
  return pa.localeCompare(pb) || Number(na) - Number(nb);
};

/** Le type "métier" d'un Asset pour la vue domaine (les WorkItems par sous-type). */
const domainType = (asset: ParsedAsset): string | null => {
  const fm = asset.fm!;
  if (fm.assetType === 'WorkItem') {
    return fm.workItemType === 'Epic' ? null : String(fm.workItemType);
  }
  return DOMAIN_TYPE_ORDER.includes(fm.assetType as never) ? String(fm.assetType) : null;
};

/** Deterministic product summary (French content, NFR-5) written to product/README.md. */
export function buildSummary(assets: ParsedAsset[], graph: AssetGraph, gaps: Gap[]): string {
  const valid = assets.filter((a) => a.fm && typeof a.fm.id === 'string');
  const staleDocs = new Set(gaps.filter((g) => g.category === 'stale-doc').map((g) => g.assetId));
  const assetById = new Map(valid.map((a) => [String(a.fm!.id), a]));

  const statusCounts = new Map<string, number>();
  for (const asset of valid) {
    const status = String(asset.fm!.status);
    statusCounts.set(status, (statusCounts.get(status) ?? 0) + 1);
  }
  const statusLine = ['Approved', 'Review', 'Generated', 'Draft', 'Deprecated']
    .filter((s) => statusCounts.has(s))
    .map((s) => `${statusCounts.get(s)} ${s}`)
    .join(' · ');

  const out: string[] = [
    '# Sommaire du produit',
    '',
    '> Généré par `pef summary` et régénéré automatiquement par la CI — ne pas éditer à la main.',
    '',
    `**${valid.length} Asset(s)** — ${statusLine || 'aucun'}. Trous de traçabilité : **${gaps.length}** (\`pef coverage\`).`,
    '',
  ];

  // ------------------------------------------------------------------
  // Partie 1 — la vue métier : un domaine fonctionnel par Epic (DEC-008)
  // ------------------------------------------------------------------
  out.push('## Vue par domaine fonctionnel', '');

  const vision = valid.find((a) => a.fm!.assetType === 'Vision');
  const goals = valid.filter((a) => a.fm!.assetType === 'Goal').sort(byId);
  if (vision || goals.length > 0) {
    const capParts: string[] = [];
    if (vision) capParts.push(`[${vision.fm!.id}](${vision.rel}) ${cell(vision.fm!.title)}`);
    if (goals.length > 0) capParts.push(`objectifs : ${goals.map((g) => `[${g.fm!.id}](${g.rel})`).join(' ')}`);
    out.push(`*Cap produit — ${capParts.join(' · ')}.*`, '');
  }

  const epics = valid
    .filter((a) => a.fm!.workItemType === 'Epic')
    .sort((a, b) =>
      (PRIORITY_ORDER[String(a.fm!.priority)] ?? 9) - (PRIORITY_ORDER[String(b.fm!.priority)] ?? 9) || byId(a, b));

  const claimed = new Set<string>();
  for (const epic of epics) {
    const epicId = String(epic.fm!.id);
    claimed.add(epicId);
    const cluster = [...downstreamIds(graph, epicId)]
      .map((id) => assetById.get(id))
      .filter((a): a is ParsedAsset => Boolean(a) && domainType(a!) !== null)
      .sort((a, b) =>
        DOMAIN_TYPE_ORDER.indexOf(domainType(a) as never) - DOMAIN_TYPE_ORDER.indexOf(domainType(b) as never) || byId(a, b));
    for (const member of cluster) claimed.add(String(member.fm!.id));

    // « sert RM-001 → GOAL-001 » : la chaîne stratégique de l'Epic
    const serves = (Array.isArray(epic.fm!.satisfies) ? epic.fm!.satisfies : [])
      .map((target) => {
        const asset = assetById.get(target);
        if (asset?.fm?.assetType !== 'Roadmap') return target;
        const goalIds = Array.isArray(asset.fm.satisfies) ? asset.fm.satisfies.join(', ') : '';
        return goalIds ? `${target} → ${goalIds}` : target;
      })
      .join(' ; ');

    out.push(`### ${cell(epic.fm!.title)} ([${epicId}](${epic.rel}))`, '');
    out.push(`*${cell(epic.fm!.priority)} · réalisation : ${cell(epic.fm!.workflowState)}${serves ? ` · sert ${serves}` : ''}*`, '');

    if (cluster.length === 0) {
      out.push('*Aucun Asset rattaché pour l\'instant.*', '');
    } else {
      out.push('| ID | Type | Titre | État |', '|---|---|---|---|');
      for (const member of cluster) {
        const fm = member.fm!;
        const type = fm.assetType === 'Documentation' ? `Doc ${fm.docType}` : domainType(member);
        const state = fm.assetType === 'WorkItem' ? fm.workflowState
          : staleDocs.has(String(fm.id)) ? `${fm.status} ⚠ périmée` : fm.status;
        out.push(`| [${fm.id}](${member.rel}) | ${cell(type)} | ${cell(fm.title)} | ${cell(state)} |`);
      }
      out.push('');
    }

    const domainGaps = gaps.filter((g) => g.assetId === epicId || cluster.some((m) => String(m.fm!.id) === g.assetId));
    out.push(domainGaps.length === 0
      ? '✔ couverture complète'
      : `⚠ ${domainGaps.length} trou(s) : ${[...new Set(domainGaps.map((g) => `\`${g.category}\``))].join(', ')}`, '');
  }

  // Ce qui devrait vivre dans un domaine mais n'est rattaché à aucun Epic
  const unclaimed = valid
    .filter((a) => domainType(a) !== null && !claimed.has(String(a.fm!.id)))
    .sort(byId);
  if (unclaimed.length > 0) {
    out.push('### Hors domaine (rattachés à aucun Epic)', '',
      '*À examiner : un Asset métier sans domaine est difficile à retrouver.*', '',
      '| ID | Type | Titre | Statut |', '|---|---|---|---|');
    for (const asset of unclaimed) {
      const fm = asset.fm!;
      const type = fm.assetType === 'Documentation' ? `Doc ${fm.docType}` : domainType(asset);
      out.push(`| [${fm.id}](${asset.rel}) | ${cell(type)} | ${cell(fm.title)} | ${cell(fm.status)} |`);
    }
    out.push('');
  }

  // ------------------------------------------------------------------
  // Partie 2 — l'inventaire par type (la vue "modèle", exhaustive)
  // ------------------------------------------------------------------
  out.push('## Inventaire par type', '');

  for (const section of SECTIONS) {
    const rows = valid.filter((a) => section.types.includes(String(a.fm!.assetType))).sort(byId);
    if (rows.length === 0) continue;
    out.push(`### ${section.title}`, '');
    const isWorkItem = section.types.includes('WorkItem');
    const isDoc = section.types.includes('Documentation');
    if (isDoc) {
      // Fonctionnelle / technique / onboarding se lisent mal mélangées (DEC-007)
      const DOC_TYPES: [string, string][] = [
        ['Functional', 'Fonctionnelle'],
        ['Technical', 'Technique'],
        ['Onboarding', 'Onboarding'],
      ];
      for (const [docType, label] of DOC_TYPES) {
        const docs = rows.filter((a) => a.fm!.docType === docType);
        if (docs.length === 0) continue;
        out.push(`#### ${label}`, '', '| ID | Titre | Statut | Version | État |', '|---|---|---|---|---|');
        for (const asset of docs) {
          const fm = asset.fm!;
          const state = staleDocs.has(String(fm.id)) ? '⚠ périmée (`stale-doc`)' : 'à jour';
          out.push(`| [${fm.id}](${asset.rel}) | ${cell(fm.title)} | ${cell(fm.status)} | ${cell(fm.version)} | ${state} |`);
        }
        out.push('');
      }
      continue;
    }
    if (isWorkItem) {
      out.push('| ID | Titre | Type | Priorité | Contenu | Réalisation |', '|---|---|---|---|---|---|');
    } else {
      out.push('| ID | Titre | Statut | Version |', '|---|---|---|---|');
    }
    for (const asset of rows) {
      const fm = asset.fm!;
      const link = `[${fm.id}](${asset.rel})`;
      if (isWorkItem) {
        out.push(`| ${link} | ${cell(fm.title)} | ${cell(fm.workItemType)} | ${cell(fm.priority)} | ${cell(fm.status)} | ${cell(fm.workflowState)} |`);
      } else {
        out.push(`| ${link} | ${cell(fm.title)} | ${cell(fm.status)} | ${cell(fm.version)} |`);
      }
    }
    out.push('');
  }

  out.push('---', '',
    'Naviguer : `pef trace <ID>` (chaîne d\'un Asset) · `pef coverage` (trous) · `pef impact <ID>` (effets d\'une modification).',
    '');
  return out.join('\n');
}
