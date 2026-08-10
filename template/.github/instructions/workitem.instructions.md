---
applyTo: "**/*.epic.md,**/*.us.md,**/*.bug.md"
---

# Rédaction d'un WorkItem (`.epic.md`, `.us.md`, `.bug.md`)

- `assetType: WorkItem` + `workItemType: Epic | UserStory | Bug` ; ID `EPIC-`/`US-`/`BUG-` selon le sous-type ; fichiers dans `product/backlog/`.
- **Deux axes indépendants** : `status` porte la validité du *contenu* (Draft → Review → Approved), `workflowState` l'état de *réalisation* (Drafting → Todo → InProgress → Validated). Passage à `Todo` : contenu `Approved` exigé (PEF010). Passage à `Validated` : AC liées `Approved` exigées (PEF011).
- `priority` optionnelle : `Must | Should | Could | Wont` (DEC-004) ; l'ordonnancement fin reste à l'outil d'exécution (`externalRef`).
- Relations par sous-type : une UserStory `refines` son Epic ; un Epic `satisfies` la Roadmap ou un Goal ; un Bug `impacts` les Assets défaillants et `dependsOn` son test de non-régression.
- UserStory : « En tant que… je veux… afin de… », taille d'une itération, AC dans sa chaîne aval.
- Bug : comportement observé vs attendu, étapes de reproduction, Assets impactés listés dans le corps.
