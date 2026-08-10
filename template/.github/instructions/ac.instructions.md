---
applyTo: "**/*.ac.md"
---

# Rédaction d'une AcceptanceCriteria (`.ac.md`)

- `assetType: AcceptanceCriteria`, ID `AC-<nnn>`, fichier placé dans le répertoire de sa Specification parente (EF-5).
- Relation obligatoire : `refines: [<SPEC-ID>]` — une AC sans Specification est un trou de traçabilité.
- Format recommandé : scénarios **Gherkin en français** (Étant donné / Quand / Alors) dans un bloc ```gherkin ; format libre accepté (DEC-002).
- Un critère = un comportement vérifiable ; les messages d'erreur cités doivent être identiques à ceux de la Specification.
- Chaque AC doit être vérifiée par au moins un TestCase (`verifies` entrant) — contrôlé par `npm run pef -- coverage`.
