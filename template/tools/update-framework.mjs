#!/usr/bin/env node
// Met à jour les fichiers FRAMEWORK d'un projet PEF depuis le template officiel,
// sans jamais toucher aux fichiers du PROJET (product/, README.md, ajouts customs).
//
// Usage :  node tools/update-framework.mjs           (depuis la racine du projet)
// Source :  variable PEF_TEMPLATE_REPO, sinon le monorepo officiel.
//
// Principe : écrasement seul, aucune suppression. Un fichier présent localement
// mais absent du template (custom ou obsolète) est signalé, jamais supprimé.
// À exécuter sur une branche, arbre git propre, puis relire le diff en PR.
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const TEMPLATE_REPO = process.env.PEF_TEMPLATE_REPO ?? 'https://github.com/zarafa-dev-io/pef.git';

// La frontière de propriété : SEULS ces chemins appartiennent au framework.
// product/, README.md et templates/ appartiennent au projet (les templates
// sont la forme personnalisée des Assets) et ne sont jamais listés ici.
const FRAMEWORK_PATHS = [
  'schemas',
  'tools',
  'processors',
  'viewer',
  '.github/copilot-instructions.md',
  '.github/instructions',
  '.github/prompts',
  '.github/skills',
  '.github/workflows/pef-validate.yml',
];

const IGNORED = new Set(['node_modules', '.git']);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const walk = (dir) => {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
};

// 0. Garde-fous
try {
  const dirty = execSync('git status --porcelain', { cwd: repoRoot, encoding: 'utf8' }).trim();
  if (dirty) {
    console.warn('⚠ L\'arbre git n\'est pas propre : commitez ou remisez avant, pour pouvoir relire le diff de mise à jour seul.');
  }
} catch {
  console.warn('⚠ Pas de dépôt git détecté : vous perdez le filet de sécurité du diff.');
}

// 1. Récupérer le template (clone sparse, jetable)
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pef-template-'));
console.log(`Template : ${TEMPLATE_REPO}`);
execSync(`git clone --depth 1 --filter=blob:none --sparse "${TEMPLATE_REPO}" "${tmp}"`, { stdio: 'pipe' });
execSync('git sparse-checkout set template', { cwd: tmp, stdio: 'pipe' });
const src = path.join(tmp, 'template');

// 2. Copier (écrasement seul) et classer chaque fichier
const report = { added: [], updated: [], unchanged: 0, custom: [] };
for (const fwPath of FRAMEWORK_PATHS) {
  const srcBase = path.join(src, fwPath);
  const destBase = path.join(repoRoot, fwPath);
  const srcFiles = fs.existsSync(srcBase) && fs.statSync(srcBase).isDirectory() ? walk(srcBase)
    : fs.existsSync(srcBase) ? [srcBase] : [];

  // Comparaison insensible aux fins de ligne : git les normalise de toute façon
  // (autocrlf), un simple CRLF/LF ne doit pas compter comme une mise à jour.
  const normalized = (buffer) => buffer.toString('utf8').replace(/\r\n/g, '\n');
  for (const file of srcFiles) {
    const rel = path.relative(src, file);
    const dest = path.join(repoRoot, rel);
    const content = fs.readFileSync(file);
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.writeFileSync(dest, content);
      report.added.push(rel);
    } else if (normalized(content) !== normalized(fs.readFileSync(dest))) {
      fs.writeFileSync(dest, content);
      report.updated.push(rel);
    } else {
      report.unchanged++;
    }
  }

  // Fichiers locaux du périmètre framework absents du template : signalés, gardés.
  if (fs.existsSync(destBase) && fs.statSync(destBase).isDirectory()) {
    for (const file of walk(destBase)) {
      const rel = path.relative(repoRoot, file);
      if (!fs.existsSync(path.join(src, rel))) report.custom.push(rel);
    }
  }
}
fs.rmSync(tmp, { recursive: true, force: true });

// 3. Rapport
const show = (list) => list.map((f) => `  ${f.replace(/\\/g, '/')}`).join('\n');
if (report.added.length) console.log(`\nAjoutés (${report.added.length}) :\n${show(report.added)}`);
if (report.updated.length) console.log(`\nMis à jour (${report.updated.length}) :\n${show(report.updated)}`);
console.log(`\nInchangés : ${report.unchanged}`);
if (report.custom.length) {
  console.log(`\nPrésents localement mais absents du template — customs ou obsolètes, NON touchés (${report.custom.length}) :\n${show(report.custom)}`);
}
console.log(`\nproduct/ et README.md n'ont pas été touchés (propriété du projet).\n
Étapes suivantes :
  cd tools/validate && npm install        # dépendances éventuellement mises à jour
  npm run pef -- validate                 # le modèle a-t-il bougé ?
  git diff                                # relire, puis committer via une PR`);
