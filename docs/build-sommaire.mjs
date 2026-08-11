#!/usr/bin/env node
// Génère docs/sommaire.md : le sommaire détaillé de toute la documentation.
// Source d'ordre : _sidebar.md ; pour chaque page : titre, chapeau, sections (h2).
// Régénéré automatiquement par le workflow docs-sommaire à chaque évolution de docs/.
// Usage local : node docs/build-sommaire.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const docsDir = dirname(fileURLToPath(import.meta.url));
const OUT = 'sommaire.md';
const EXCLUDED = new Set(['_sidebar.md', OUT]);
const MAX_SECTIONS = 12; // au-delà (manifeste, PRD), on n'affiche que le compte

// Approximation du slugify Docsify (les ancres ratées dégradent en haut de page)
const slugify = (s) =>
  s.trim().toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[«»"'’“”(),;:!?.…·/\\[\]`*]/g, '')
    .replace(/\s+/g, '-');

const stripMd = (s) =>
  s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

function parsePage(relPath) {
  let raw;
  try {
    raw = readFileSync(join(docsDir, relPath), 'utf8').replace(/^﻿/, '');
  } catch {
    return null;
  }
  raw = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, ''); // front matter éventuel
  const lines = raw.split(/\r?\n/);
  let title = null;
  let blurb = null;
  const sections = [];
  let inCode = false;
  for (const line of lines) {
    if (/^```/.test(line)) { inCode = !inCode; continue; }
    if (inCode) continue;
    if (!title && /^# /.test(line)) { title = stripMd(line.slice(2)); continue; }
    if (/^## /.test(line)) { sections.push(line.slice(3).trim()); continue; }
    if (title && !blurb && line.trim() && !/^[#|\-<!\[]/.test(line.trim())) {
      blurb = stripMd(line);
    }
  }
  if (blurb && blurb.length > 220) {
    blurb = blurb.slice(0, 220).replace(/\s+\S*$/, '') + '…';
  }
  return { title, blurb, sections };
}

// 1. L'ordre canonique vient de _sidebar.md
const sidebar = readFileSync(join(docsDir, '_sidebar.md'), 'utf8');
const groups = [];
let current = null;
for (const line of sidebar.split(/\r?\n/)) {
  const group = line.match(/^-\s+\*\*(.+?)\*\*/);
  const page = line.match(/^\s+-\s+\[(.+?)\]\((.+?)\)/);
  if (group) { current = { title: group[1], pages: [] }; groups.push(current); }
  else if (page && current) {
    const pagePath = page[2] === '/' ? 'README.md' : page[2];
    if (pagePath !== OUT) current.pages.push({ label: page[1], path: pagePath });
  }
}

// 2. Les pages hors sidebar sont détectées, jamais perdues
const inSidebar = new Set(groups.flatMap((g) => g.pages.map((p) => p.path)));
const orphans = readdirSync(docsDir, { recursive: true })
  .map(String).map((p) => p.replace(/\\/g, '/'))
  .filter((p) => p.endsWith('.md') && !EXCLUDED.has(p) && !inSidebar.has(p));
if (orphans.length > 0) {
  groups.push({ title: 'Hors sommaire (à classer dans _sidebar.md)', pages: orphans.map((p) => ({ label: p, path: p })) });
}

// 3. Génération
const out = ['# Sommaire de la documentation', '',
  '> Page générée par `node docs/build-sommaire.mjs` et régénérée automatiquement à chaque évolution de `docs/` (workflow `docs-sommaire`). **Ne pas l\'éditer à la main.**', ''];
for (const group of groups) {
  out.push(`## ${group.title}`, '');
  for (const page of group.pages) {
    const parsed = parsePage(page.path);
    if (!parsed) continue;
    out.push(`### [${parsed.title ?? page.label}](${page.path})`, '');
    if (parsed.blurb) out.push(parsed.blurb, '');
    if (parsed.sections.length > MAX_SECTIONS) {
      out.push(`*${parsed.sections.length} sections — voir la page.*`, '');
    } else if (parsed.sections.length > 0) {
      out.push(parsed.sections.map((s) => `[${stripMd(s)}](${page.path}#${slugify(s)})`).join(' · '), '');
    }
  }
}
writeFileSync(join(docsDir, OUT), out.join('\n'), 'utf8');
console.log(`${OUT}: ${groups.length} groupe(s), ${groups.reduce((n, g) => n + g.pages.length, 0)} page(s).`);
