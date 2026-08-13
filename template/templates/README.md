# Templates des Product Assets

Un modèle par assetType (`spec.template.md`, `us.template.md`, …) : la **forme** de vos Assets. Les Processors IA et les humains partent de ces fichiers pour toute création (skill `pef-asset-authoring`).

**Ces templates appartiennent à votre projet** : personnalisez-les (sections, tournures, mentions obligatoires de votre organisation) — les générations suivront votre forme sans toucher aux prompts. `update-framework` ne les écrase **pas** : vos personnalisations survivent aux mises à jour du framework.

Quatre couches, deux propriétaires :

| Couche | Fichier | Qui la possède |
|---|---|---|
| Le contrat (front matter) | `schemas/0.1/asset.schema.json` | le framework |
| La forme (structure du corps) | `templates/*.template.md` | **votre projet** |
| Le contenu (règles de rédaction) | `guidelines/` | **votre projet** |
| Le comportement (génération) | `.github/prompts/*.prompt.md` | le framework |

Règle d'or en personnalisant : ne touchez pas aux clés du front matter (le schéma fait foi) — tout le reste est à vous.
