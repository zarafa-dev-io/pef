---
applyTo: "**/*.tp.md"
---

# Rédaction d'un TestPlan (`.tp.md`)

- `assetType: TestPlan`, ID `TP-<nnn>`, dans son propre répertoire `product/quality/TP-<nnn>-<slug>/` (ses TestCases y seront regroupés, EF-5).
- Relation obligatoire : `verifies: [<SPEC-ID>]`.
- Structure : **Périmètre**, **Stratégie** (type de tests, données, environnement), **Cas couverts** (matrice AC → TestCase garantissant qu'aucune AC n'est orpheline).
