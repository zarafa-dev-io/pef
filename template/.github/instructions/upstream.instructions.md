---
applyTo: "**/*.vis.md,**/*.goal.md,**/*.rm.md,**/*.per.md,**/*.rel.md"
---

# Rédaction des Assets amont (`.vis.md`, `.goal.md`, `.rm.md`, `.per.md`, `.rel.md`)

- **Vision** (`VIS-`, `product/vision/`) : problème, cible, proposition de valeur, non-objectifs. Une page, langage métier.
- **Goal** (`GOAL-`, `product/goals/`) : objectif **mesurable**, `refines` la Vision. Un Goal sans WorkItem aval est signalé par la couverture.
- **Roadmap** (`RM-`, `product/roadmap/`) : **un Asset par élément** (thème × horizon, DEC-005), `satisfies` son Goal, avec un critère de sortie observable. Jamais de roadmap monolithique.
- **Persona** (`PER-`, `product/personas/`) : profil, objectifs, frustrations (fidèles aux notes — rien d'inventé), critère d'adoption ; `refines` la Vision.
- **Release** (`REL-`, `product/releases/`) : langage métier, `dependsOn` les WorkItems livrés (`workflowState: Validated` uniquement), section vérification citant les tests exécutés.
- La matière amont est plus subjective : toute production IA reste une **proposition** (`Generated`) — la formulation finale appartient au PO.
