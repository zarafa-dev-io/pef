import * as fs from 'node:fs';
import * as path from 'node:path';
import { execFileSync } from 'node:child_process';
import Ajv2020Module from 'ajv/dist/2020.js';

// Ajv ships CJS; depending on the loader the class is the module itself or its
// `default` property. Resolve both so tsx, node and tsc agree.
const Ajv = ((Ajv2020Module as { default?: unknown }).default ?? Ajv2020Module) as
  new (opts?: object) => {
    compile(schema: object): ((data: unknown) => boolean) & {
      errors?: { instancePath: string; message?: string }[] | null;
    };
  };
import { parse as parseYaml } from 'yaml';
import { loadAssets, findLine, type ParsedAsset } from '../lib/assets.js';
import { buildGraph, downstreamIds, outboundRefs, type AssetGraph } from '../lib/graph.js';
import {
  ALLOWED_TRANSITIONS,
  ALLOWED_WORKFLOW_TRANSITIONS,
  expectedPrefix,
  expectedSuffix,
  type FrontMatter,
} from '../lib/model.js';
import { schemaPath } from '../lib/paths.js';

export interface Issue {
  file: string;
  line: number;
  rule: string;
  message: string;
}

export interface ValidateResult {
  issues: Issue[];
  assets: ParsedAsset[];
  graph: AssetGraph;
}

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

function oldFrontMatterAt(sinceRef: string, file: string, root: string): FrontMatter | null | 'absent' {
  let gitRoot: string;
  try {
    gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'absent';
  }
  const rel = path.relative(gitRoot, file).replace(/\\/g, '/');
  let old: string;
  try {
    old = execFileSync('git', ['show', `${sinceRef}:${rel}`], {
      cwd: gitRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'], // a missing path at the ref is expected, keep git quiet
    });
  } catch {
    return 'absent'; // file did not exist at the reference: any initial status is allowed
  }
  const match = FRONT_MATTER_RE.exec(old.replace(/^﻿/, ''));
  if (!match) return null;
  try {
    const fm = parseYaml(match[1]);
    return fm && typeof fm === 'object' && !Array.isArray(fm) ? (fm as FrontMatter) : null;
  } catch {
    return null;
  }
}

export function runValidate(root: string, opts: { since?: string } = {}): ValidateResult {
  const assets = loadAssets(root);
  const graph = buildGraph(assets);
  const issues: Issue[] = [];
  const push = (asset: ParsedAsset, line: number, rule: string, message: string) =>
    issues.push({ file: asset.rel, line, rule, message });

  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
  const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
  const validateFm = ajv.compile(schema);

  for (const asset of assets) {
    // PEF001 — parseable front matter
    if (!asset.fm) {
      push(asset, 1, 'PEF001', asset.parseError ?? 'unreadable front matter');
      continue;
    }
    const fm = asset.fm;
    const id = typeof fm.id === 'string' ? fm.id : undefined;

    // PEF002 — JSON Schema conformity
    if (!validateFm(fm)) {
      for (const err of validateFm.errors ?? []) {
        const key = err.instancePath.split('/')[1] ?? '';
        const line = key ? findLine(asset.raw, `${key}:`) : 1;
        push(asset, line, 'PEF002', `${err.instancePath || 'front matter'} ${err.message}`);
      }
    }

    // PEF003 — ID prefix must match assetType (and workItemType)
    const prefix = expectedPrefix(fm);
    if (id && prefix && !id.startsWith(`${prefix}-`)) {
      push(asset, findLine(asset.raw, 'id:'), 'PEF003',
        `id "${id}" does not match expected prefix "${prefix}-" for assetType ${fm.assetType}${fm.workItemType ? `/${fm.workItemType}` : ''}`);
    }

    // PEF004 — file naming convention (EF-35): <ID>-<slug>.<suffix>.md
    const suffix = expectedSuffix(fm);
    if (id && suffix) {
      const base = path.basename(asset.rel);
      const re = new RegExp(`^${id}(-[a-z0-9][a-z0-9-]*)?\\.${suffix}\\.md$`);
      if (!re.test(base)) {
        push(asset, 1, 'PEF004',
          `file name "${base}" does not follow "<ID>-<slug>.${suffix}.md" (expected e.g. "${id}-my-slug.${suffix}.md")`);
      }
    }

    // PEF007 — no self-reference
    for (const ref of outboundRefs(asset)) {
      if (id && ref.target === id) {
        push(asset, findLine(asset.raw, `${ref.key}:`), 'PEF007', `asset references itself via "${ref.key}"`);
      }
    }

    // Transition controls (EF-4, EF-30), only with --since <git ref>
    if (opts.since && id) {
      const old = oldFrontMatterAt(opts.since, asset.file, root);
      if (old && old !== 'absent') {
        // PEF008 — asset status transitions (EF-4)
        if (typeof fm.status === 'string' && typeof old.status === 'string' && old.status !== fm.status) {
          const allowed = ALLOWED_TRANSITIONS[old.status];
          if (allowed && !allowed.includes(fm.status)) {
            push(asset, findLine(asset.raw, 'status:'), 'PEF008',
              `status transition "${old.status}" -> "${fm.status}" is not allowed (allowed from "${old.status}": ${allowed.length ? allowed.join(', ') : 'none'})`);
          }
        }
        // PEF009/010/011 — WorkItem realization axis (EF-30)
        if (fm.assetType === 'WorkItem' && typeof fm.workflowState === 'string' &&
            typeof old.workflowState === 'string' && old.workflowState !== fm.workflowState) {
          const oldWf = old.workflowState;
          const newWf = fm.workflowState;
          const allowed = ALLOWED_WORKFLOW_TRANSITIONS[oldWf];
          if (allowed && !allowed.includes(newWf)) {
            push(asset, findLine(asset.raw, 'workflowState:'), 'PEF009',
              `workflowState transition "${oldWf}" -> "${newWf}" is not allowed (allowed from "${oldWf}": ${allowed.join(', ')})`);
          }
          if (newWf === 'Todo' && fm.status !== 'Approved') {
            push(asset, findLine(asset.raw, 'workflowState:'), 'PEF010',
              `entering workflowState "Todo" requires asset status "Approved" (current: "${fm.status}") — content must be validated before execution`);
          }
          if (newWf === 'Validated') {
            const linkedAcs = [...downstreamIds(graph, id)]
              .filter((t) => graph.byId.get(t)?.[0]?.fm?.assetType === 'AcceptanceCriteria');
            const notApproved = linkedAcs
              .filter((t) => graph.byId.get(t)?.[0]?.fm?.status !== 'Approved');
            if (notApproved.length > 0) {
              push(asset, findLine(asset.raw, 'workflowState:'), 'PEF011',
                `entering workflowState "Validated" requires linked AcceptanceCriteria to be "Approved" (not approved: ${notApproved.join(', ')})`);
            }
          }
        }
      }
    }
  }

  // PEF005 — ID uniqueness across the repository
  for (const [id, claimants] of graph.byId) {
    if (claimants.length > 1) {
      for (const asset of claimants) {
        push(asset, findLine(asset.raw, 'id:'), 'PEF005',
          `duplicate id "${id}" (also used by ${claimants.filter((a) => a !== asset).map((a) => a.rel).join(', ')})`);
      }
    }
  }

  // PEF006 — every reference must resolve
  for (const asset of assets) {
    if (!asset.fm?.id) continue;
    for (const ref of outboundRefs(asset)) {
      if (!graph.byId.has(ref.target)) {
        push(asset, findLine(asset.raw, ref.target), 'PEF006',
          `unresolved reference "${ref.key}: ${ref.target}"`);
      }
    }
  }

  issues.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
  return { issues, assets, graph };
}
