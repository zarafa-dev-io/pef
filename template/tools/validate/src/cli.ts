import { defaultProductRoot } from './lib/paths.js';
import { loadAssets } from './lib/assets.js';
import { buildGraph } from './lib/graph.js';
import { runValidate } from './commands/validate.js';
import { runCoverage } from './commands/coverage.js';
import { runTrace } from './commands/trace.js';
import { runImpact } from './commands/impact.js';
import { computeActions, applyActions } from './commands/signal.js';
import { buildSummary } from './commands/summary.js';
import * as fs from 'node:fs';
import * as path from 'node:path';

const HELP = `pef — PEF validation engine (MVP, Node/TypeScript)

Usage: npm run pef -- <command> [options]

Commands:
  validate [--since <git-ref>]   Check schema, IDs, references, naming, statuses (EF-10/11)
  coverage [--strict]            Report traceability gaps; --strict exits 1 on gaps (EF-12)
  trace <ID>                     Bidirectional traceability chain of an asset (EF-13)
  impact <ID>                    Downstream assets impacted by a change (EF-24)
  signal [--apply]               Sync gaps to GitHub issues via gh; default is dry-run (EF-33)
  summary                        Generate product/README.md, the asset index (auto-refreshed by CI)

Options:
  --root <dir>                   Product assets root (default: <repo>/product)
`;

function parseArgs(argv: string[]) {
  const [command, ...rest] = argv;
  const opts: Record<string, string | boolean> = {};
  const positional: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === '--strict' || arg === '--apply') opts[arg.slice(2)] = true;
    else if (arg === '--since' || arg === '--root') opts[arg.slice(2)] = rest[++i];
    else positional.push(arg);
  }
  return { command, opts, positional };
}

const { command, opts, positional } = parseArgs(process.argv.slice(2));
const root = typeof opts.root === 'string' ? opts.root : defaultProductRoot;

switch (command) {
  case 'validate': {
    const { issues, assets } = runValidate(root, { since: typeof opts.since === 'string' ? opts.since : undefined });
    for (const issue of issues) {
      console.log(`${issue.file}:${issue.line}  ${issue.rule}  ${issue.message}`);
    }
    console.log(`\n${assets.length} asset(s) checked, ${issues.length} error(s).`);
    process.exit(issues.length > 0 ? 1 : 0);
  }
  case 'coverage': {
    const assets = loadAssets(root);
    const graph = buildGraph(assets);
    const gaps = runCoverage(assets, graph);
    let current = '';
    for (const gap of gaps) {
      if (gap.category !== current) {
        current = gap.category;
        console.log(`\n[${current}]`);
      }
      console.log(`  ${gap.file}  ${gap.message}`);
    }
    console.log(`\n${assets.length} asset(s) analysed, ${gaps.length} gap(s).`);
    process.exit(opts.strict && gaps.length > 0 ? 1 : 0);
  }
  case 'trace': {
    if (!positional[0]) { console.error('usage: pef trace <ID>'); process.exit(2); }
    const graph = buildGraph(loadAssets(root));
    const lines = runTrace(graph, positional[0]);
    console.log(lines.join('\n'));
    process.exit(lines[0].startsWith('unknown') ? 1 : 0);
  }
  case 'impact': {
    if (!positional[0]) { console.error('usage: pef impact <ID>'); process.exit(2); }
    const graph = buildGraph(loadAssets(root));
    const impacted = runImpact(graph, positional[0]);
    if (impacted === null) { console.error(`unknown asset id "${positional[0]}"`); process.exit(1); }
    if (impacted.length === 0) console.log(`No downstream asset references ${positional[0]}.`);
    for (const asset of impacted) {
      const flag = asset.assetType === 'TestCase' || asset.assetType === 'TestPlan' ? '  ⚠ test asset' : '';
      console.log(`${asset.id}  [${asset.assetType}]  ${asset.title}  (via ${asset.via})${flag}`);
    }
    process.exit(0);
  }
  case 'summary': {
    const assets = loadAssets(root);
    const graph = buildGraph(assets);
    const gaps = runCoverage(assets, graph);
    const outFile = path.join(root, 'README.md');
    fs.writeFileSync(outFile, buildSummary(assets, gaps), 'utf8');
    console.log(`${outFile}: ${assets.length} asset(s) indexed, ${gaps.length} gap(s) reported.`);
    process.exit(0);
  }
  case 'signal': {
    const { issues, assets, graph } = runValidate(root);
    const gaps = runCoverage(assets, graph);
    const actions = computeActions(assets, issues, gaps, graph);
    if (!opts.apply) {
      console.log(`Dry-run: ${actions.length} issue(s) would be synchronised (use --apply to run gh):\n`);
      for (const action of actions) console.log(`  ${action.title}`);
      process.exit(0);
    }
    for (const line of applyActions(actions)) console.log(line);
    process.exit(0);
  }
  default:
    console.log(HELP);
    process.exit(command ? 2 : 0);
}
