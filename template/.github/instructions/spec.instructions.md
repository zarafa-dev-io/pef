---
applyTo: "**/*.spec.md"
---

# Rédaction d'une Specification (`.spec.md`)

- `assetType: Specification`, ID `SPEC-<nnn>`, fichier dans son propre répertoire `product/specifications/SPEC-<nnn>-<slug>/` (ses AC y seront regroupées, EF-5).
- Relations : `satisfies` vers les Requirements et NFR couverts, `dependsOn` vers les BusinessRules appliquées.
- Structure recommandée : **Champs** (tableau avec contrôles), **Comportement** (numéroté, observable), **Messages d'erreur** (texte exact — les TestCases les reprendront tels quels).
- Toute règle métier citée doit exister comme Asset `BR-` référencé ; ne jamais paraphraser une règle sans la lier.
- Une modification de Specification impacte les tests : exécuter `npm run pef -- impact SPEC-<nnn>` et le signaler dans la PR.
