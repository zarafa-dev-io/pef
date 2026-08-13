# Explorateur du produit

Visualiseur local des Product Assets (`product/`), plus navigable que GitHub :

- **carte Mermaid cliquable** (les `click` du sommaire, ignorés par GitHub, sont actifs ici) ;
- **front matter rendu** en bandeau lisible, chaque relation (`refines`, `verifies`…) cliquable ;
- **tout ID d'Asset mentionné n'importe où devient un lien** (via `product/asset-index.json`, généré par `pef summary`) ;
- recherche plein texte.

## Lancer

```bash
npx serve .          # depuis la racine du repo
# puis http://localhost:3000/viewer/
```

## À savoir

- ⚠ **Usage local uniquement pour une instance** : ne publiez pas ce viewer (Pages) — la connaissance produit est privée.
- Nécessite l'accès aux CDN jsdelivr (Docsify, Mermaid) — comme le site de documentation du framework.
- L'index de navigation se régénère avec le sommaire : `cd tools/validate && npm run pef -- summary` (la CI le fait à chaque push).
