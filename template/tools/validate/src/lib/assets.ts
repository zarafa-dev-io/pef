import * as fs from 'node:fs';
import * as path from 'node:path';
import { parse as parseYaml } from 'yaml';
import type { FrontMatter } from './model.js';

export interface ParsedAsset {
  /** Absolute file path */
  file: string;
  /** Path relative to the product root, with forward slashes */
  rel: string;
  raw: string;
  body: string;
  fm: FrontMatter | null;
  parseError?: string;
}

const IGNORED_DIRS = new Set(['node_modules', '.git']);

/** Every .md file under root is expected to be a PEF asset, except README.md files. */
export function discoverMarkdown(root: string): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) {
        if (!IGNORED_DIRS.has(entry.name) && !entry.name.startsWith('.')) {
          walk(path.join(dir, entry.name));
        }
      } else if (
        entry.name.toLowerCase().endsWith('.md') &&
        entry.name.toLowerCase() !== 'readme.md'
      ) {
        out.push(path.join(dir, entry.name));
      }
    }
  };
  walk(root);
  return out.sort();
}

const FRONT_MATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

/** Tolerates UTF-8 BOM and CRLF line endings (Windows-authored files). */
export function parseAsset(file: string, root: string): ParsedAsset {
  const raw = fs.readFileSync(file, 'utf8').replace(/^﻿/, '');
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const match = FRONT_MATTER_RE.exec(raw);
  if (!match) {
    return { file, rel, raw, body: raw, fm: null, parseError: 'missing YAML front matter block (---)' };
  }
  try {
    const fm = parseYaml(match[1]) as FrontMatter;
    if (fm === null || typeof fm !== 'object' || Array.isArray(fm)) {
      return { file, rel, raw, body: '', fm: null, parseError: 'front matter is not a YAML mapping' };
    }
    return { file, rel, raw, body: raw.slice(match[0].length), fm };
  } catch (e) {
    return { file, rel, raw, body: '', fm: null, parseError: `invalid YAML: ${(e as Error).message}` };
  }
}

/** Best-effort line number of the first line containing `needle` (for reports). */
export function findLine(raw: string, needle: string): number {
  const idx = raw.split(/\r?\n/).findIndex((l) => l.includes(needle));
  return idx >= 0 ? idx + 1 : 1;
}

export function loadAssets(root: string): ParsedAsset[] {
  return discoverMarkdown(root).map((f) => parseAsset(f, root));
}
