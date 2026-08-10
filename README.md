# PEF — Product Engineering Framework (monorepo)

> Les méthodes changent. Les outils changent. Les IA changent. **Les Product Assets restent.**

Monorepo du MVP PEF (voir `docs/prd-pef-mvp.md`), composé de trois sous-répertoires autonomes, séparables en trois dépôts (`pef-template`, `pef-cli`, `pef-docs`) quand QO-1 (licence) sera tranchée :

| Répertoire | Contenu |
|---|---|
| [`template/`](template/) | Dépôt projet cible modèle : schémas, moteur de validation Node/TS, assets IA Copilot, CI, exemple complet |
| [`cli/`](cli/) | CLI `pef` en Go — **lot 5, différé** (le script Node/TS du template fait référence au MVP) |
| [`docs/`](docs/) | Documentation Docsify : manifeste, PRD, guide de démarrage, référence du modèle |

## Démarrage rapide

```bash
cd template/tools/validate
npm install
npm run pef -- validate
npm run pef -- coverage
npm run pef -- trace SPEC-001
```

Documentation : servir `docs/` (ex. `npx serve docs`) ou lire directement [`docs/getting-started.md`](docs/getting-started.md).
