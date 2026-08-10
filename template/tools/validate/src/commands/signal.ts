import { execFileSync } from 'node:child_process';
import type { ParsedAsset } from '../lib/assets.js';
import { downstreamIds, upstreamIds, type AssetGraph } from '../lib/graph.js';
import type { Issue } from './validate.js';
import type { Gap } from './coverage.js';

export interface SignalAction {
  /** EF-33 action type: review-required | coverage-gap | broken-ref */
  type: string;
  assetId: string;
  title: string;
  body: string;
}

const TITLE_PREFIX = '[PEF]';

/**
 * EF-33: turn validate/coverage reports into actionable GitHub issues — one
 * open issue per (asset, action type), deduplicated by title, auto-closed when
 * the deterministic check no longer reports the gap. Action types: lot 1
 * review-required / coverage-gap / broken-ref ; lot 4 rules-to-validate (EF-27)
 * and doc-enrichment (EF-31, two-step trigger: deterministic detection here,
 * AI execution on the workstation). Local-first: runs `gh` from the
 * workstation; CI is an optional relay.
 */
export function computeActions(
  assets: ParsedAsset[],
  issues: Issue[],
  gaps: Gap[],
  graph?: AssetGraph,
): SignalAction[] {
  const actions = new Map<string, SignalAction>();
  const add = (type: string, assetId: string, detail: string, check: string) => {
    const title = `${TITLE_PREFIX} ${type}: ${assetId}`;
    const existing = actions.get(title);
    if (existing) {
      existing.body += `\n- ${detail}`;
    } else {
      actions.set(title, {
        type,
        assetId,
        title,
        body: `Asset: \`${assetId}\`\nAction type: \`${type}\`\n\n- ${detail}\n\nVerify with: \`${check}\``,
      });
    }
  };

  for (const asset of assets) {
    if (!asset.fm?.id) continue;
    if (asset.fm.status === 'Review' || asset.fm.status === 'Generated') {
      add('review-required', String(asset.fm.id),
        `\`${asset.rel}\` is in status \`${asset.fm.status}\` and awaits human review`,
        'npm run pef -- validate');
    }
  }
  for (const gap of gaps) {
    const type = gap.category === 'broken-ref' ? 'broken-ref'
      : gap.category === 'stale-doc' ? 'stale-doc'
      : 'coverage-gap';
    add(type, gap.assetId, gap.message, 'npm run pef -- coverage');
  }
  for (const issue of issues.filter((i) => i.rule === 'PEF006')) {
    add('broken-ref', issue.file, issue.message, 'npm run pef -- validate');
  }

  // EF-27 — inferred BusinessRules await explicit business validation
  for (const asset of assets) {
    if (asset.fm?.assetType === 'BusinessRule' && asset.fm.certainty === 'inferred' &&
        asset.fm.status !== 'Approved' && asset.fm.status !== 'Deprecated') {
      add('rules-to-validate', String(asset.fm.id),
        `\`${asset.rel}\` was inferred from code (certainty: inferred) and awaits business validation`,
        'npm run pef -- validate');
    }
  }

  // EF-31 step 1 — a Validated WorkItem whose chain is covered by a now-stale
  // Documentation triggers a doc-enrichment signal (execution stays human+local)
  if (graph) {
    const staleDocs = new Set(gaps.filter((g) => g.category === 'stale-doc').map((g) => g.assetId));
    for (const asset of assets) {
      if (asset.fm?.assetType !== 'WorkItem' || asset.fm.workflowState !== 'Validated') continue;
      const id = String(asset.fm.id);
      const chain = new Set([id, ...upstreamIds(graph, id), ...downstreamIds(graph, id)]);
      const docsToEnrich = [...staleDocs].filter((docId) => {
        const doc = graph.byId.get(docId)?.[0];
        const documented = Array.isArray(doc?.fm?.documents) ? (doc.fm.documents as string[]) : [];
        return documented.some((d) => chain.has(d));
      });
      if (docsToEnrich.length > 0) {
        add('doc-enrichment', id,
          `WorkItem ${id} is Validated and its chain is covered by stale Documentation: ${docsToEnrich.join(', ')} — run the EnrichDocumentation processor locally`,
          'npm run pef -- coverage');
      }
    }
  }

  return [...actions.values()];
}

const gh = (args: string[]): string => execFileSync('gh', args, { encoding: 'utf8' });

export function applyActions(actions: SignalAction[]): string[] {
  const log: string[] = [];
  const open: { number: number; title: string }[] = JSON.parse(
    gh(['issue', 'list', '--label', 'pef', '--state', 'open', '--limit', '500', '--json', 'number,title']),
  );
  const desired = new Map(actions.map((a) => [a.title, a]));
  const existing = new Map(open.map((i) => [i.title, i.number]));

  for (const action of actions) {
    if (existing.has(action.title)) {
      log.push(`unchanged  ${action.title} (#${existing.get(action.title)})`);
    } else {
      gh(['issue', 'create', '--title', action.title, '--body', action.body,
        '--label', 'pef', '--label', action.type]);
      log.push(`created    ${action.title}`);
    }
  }
  for (const issue of open) {
    if (issue.title.startsWith(TITLE_PREFIX) && !desired.has(issue.title)) {
      gh(['issue', 'close', String(issue.number), '--comment',
        'Closed by `pef signal`: the deterministic check no longer reports this gap.']);
      log.push(`closed     ${issue.title} (#${issue.number})`);
    }
  }
  return log;
}
