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
import { loadAssets, findLine, type ParsedAsset } from '../lib/assets.js';
import { buildGraph, outboundRefs, type AssetGraph } from '../lib/graph.js';
import { ALLOWED_TRANSITIONS, expectedPrefix, expectedSuffix } from '../lib/model.js';
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

function oldStatusAt(sinceRef: string, file: string, root: string): string | null | 'absent' {
  let gitRoot: string;
  try {
    gitRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], { cwd: root, encoding: 'utf8' }).trim();
  } catch {
    return 'absent';
  }
  const rel = path.relative(gitRoot, file).replace(/\\/g, '/');
  let old: string;
  try {
    old = execFileSync('git', ['show', `${sinceRef}:${rel}`], { cwd: gitRoot, encoding: 'utf8' });
  } catch {
    return 'absent'; // file did not exist at the reference: any initial status is allowed
  }
  const match = FRONT_MATTER_RE.exec(old.replace(/^﻿/, ''));
  if (!match) return null;
  const statusLine = match[1].split(/\r?\n/).find((l) => /^status\s*:/.test(l));
  return statusLine ? statusLine.split(':')[1].trim().replace(/^["']|["']$/g, '') : null;
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

    // PEF008 — status transition control (EF-4), only with --since <git ref>
    if (opts.since && id && typeof fm.status === 'string') {
      const old = oldStatusAt(opts.since, asset.file, root);
      if (old && old !== 'absent' && old !== fm.status) {
        const allowed = ALLOWED_TRANSITIONS[old];
        if (allowed && !allowed.includes(fm.status)) {
          push(asset, findLine(asset.raw, 'status:'), 'PEF008',
            `status transition "${old}" -> "${fm.status}" is not allowed (allowed from "${old}": ${allowed.length ? allowed.join(', ') : 'none'})`);
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
