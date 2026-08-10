---
applyTo: "**/*.tc.md"
---

# Rédaction d'un TestCase (`.tc.md`)

- `assetType: TestCase`, ID `TC-<nnn>`, fichier placé dans le répertoire de son TestPlan parent (EF-5).
- Relations obligatoires : `refines: [<TP-ID>]` et `verifies: [<AC-IDs>]`.
- Structure : **Préconditions** (données précises), **Étapes** numérotées actionnables sans connaître le produit, **Résultat attendu** observable avec les messages exacts de la Specification.
- Un TestCase vérifie peu d'AC (idéalement une) ; préférer plusieurs cas courts à un scénario fleuve.
