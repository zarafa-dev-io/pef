---
applyTo: "**/*.doc.md"
---

# Rédaction d'une Documentation (`.doc.md`)

- `assetType: Documentation` + `docType: Functional | Technical | Onboarding` ; ID `DOC-`.
- **Rangement par type** (pour distinguer d'un coup d'œil ce qui parle métier de ce qui parle système) : `product/documentation/fonctionnelle/`, `product/documentation/technique/`, `product/documentation/onboarding/`. Le front matter reste la source de vérité ; le répertoire est la projection lisible.
- Le titre commence par la nature du document : « Documentation fonctionnelle — … », « Documentation technique — … », « Parcours d'onboarding — … ».
- Relation `documents` obligatoire en pratique : une Documentation qui ne couvre aucun Asset est signalée (`doc-without-documents`).
- **`coveredVersions` est le mécanisme anti-péremption** : à l'approbation, enregistrer la version courante de chaque Asset documenté (exigé par PEF012 en statut `Approved`). Si un Asset couvert évolue ensuite, la couverture signale `stale-doc`.
- `codeRefs` : format `<repo>/<chemin>[:<lignes>]` (le code est ouvert dans le workspace multi-root, DEC-006) — non validés par le CLI, rafraîchis via `/refresh-documentation`.
- Fonctionnelle : des capacités et des règles, en langage métier — jamais de composants techniques. Technique : factuelle, chaque affirmation référencée, incohérences signalées jamais lissées. Onboarding : un parcours ordonné et commenté, pas un inventaire.
- Contenu issu de règles `inferred` : toujours précédé de « sous réserve de validation métier ».
