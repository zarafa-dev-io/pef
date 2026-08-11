import type { ParsedAsset } from '../lib/assets.js';
import type { Gap } from './coverage.js';

interface Section {
  title: string;
  types: string[];
}

// Ordre de lecture : de la vision vers la preuve, puis la gouvernance.
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

const cell = (value: unknown): string => String(value ?? '—').replace(/\|/g, '\\|');

const byId = (a: ParsedAsset, b: ParsedAsset): number => {
  const [pa, na] = String(a.fm!.id).split('-');
  const [pb, nb] = String(b.fm!.id).split('-');
  return pa.localeCompare(pb) || Number(na) - Number(nb);
};

/** Deterministic product summary (French content, NFR-5) written to product/README.md. */
export function buildSummary(assets: ParsedAsset[], gaps: Gap[]): string {
  const valid = assets.filter((a) => a.fm && typeof a.fm.id === 'string');
  const staleDocs = new Set(gaps.filter((g) => g.category === 'stale-doc').map((g) => g.assetId));

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

  for (const section of SECTIONS) {
    const rows = valid.filter((a) => section.types.includes(String(a.fm!.assetType))).sort(byId);
    if (rows.length === 0) continue;
    out.push(`## ${section.title}`, '');
    const isWorkItem = section.types.includes('WorkItem');
    const isDoc = section.types.includes('Documentation');
    if (isWorkItem) {
      out.push('| ID | Titre | Type | Priorité | Contenu | Réalisation |', '|---|---|---|---|---|---|');
    } else if (isDoc) {
      out.push('| ID | Titre | Type | Statut | Version | État |', '|---|---|---|---|---|---|');
    } else {
      out.push('| ID | Titre | Statut | Version |', '|---|---|---|---|');
    }
    for (const asset of rows) {
      const fm = asset.fm!;
      const link = `[${fm.id}](${asset.rel})`;
      if (isWorkItem) {
        out.push(`| ${link} | ${cell(fm.title)} | ${cell(fm.workItemType)} | ${cell(fm.priority)} | ${cell(fm.status)} | ${cell(fm.workflowState)} |`);
      } else if (isDoc) {
        const state = staleDocs.has(String(fm.id)) ? '⚠ périmée (`stale-doc`)' : 'à jour';
        out.push(`| ${link} | ${cell(fm.title)} | ${cell(fm.docType)} | ${cell(fm.status)} | ${cell(fm.version)} | ${state} |`);
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
