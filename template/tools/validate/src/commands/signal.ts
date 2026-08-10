import { execFileSync } from 'node:child_process';
import type { ParsedAsset } from '../lib/assets.js';
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
 * EF-33 (lot 1 subset): turn validate/coverage reports into actionable GitHub
 * issues — one open issue per (asset, action type), deduplicated by title,
 * auto-closed when the deterministic check no longer reports the gap.
 * Local-first: runs `gh` from the workstation; CI is an optional relay.
 */
export function computeActions(assets: ParsedAsset[], issues: Issue[], gaps: Gap[]): SignalAction[] {
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
    add(gap.category === 'broken-ref' ? 'broken-ref' : 'coverage-gap', gap.assetId, gap.message,
      'npm run pef -- coverage');
  }
  for (const issue of issues.filter((i) => i.rule === 'PEF006')) {
    add('broken-ref', issue.file, issue.message, 'npm run pef -- validate');
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
