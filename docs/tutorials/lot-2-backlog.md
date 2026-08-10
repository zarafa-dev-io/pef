# Tutoriel — Constituer et vivre le backlog (lot 2)

Objectif : construire le backlog (Epics, UserStories, Bugs), le raffiner, et suivre la **réalisation** des WorkItems sans quitter le repo.

## 1. Les deux axes d'un WorkItem

| Axe | Champ | Valeurs | Question à laquelle il répond |
|---|---|---|---|
| Contenu | `status` | Draft → Review → Approved | « Ce qui est écrit est-il juste ? » |
| Réalisation | `workflowState` | Drafting → Todo → InProgress → Validated | « Où en est le travail ? » |

Les deux sont indépendants : une US `Validated` dont la Spec évolue repasse en revue de *contenu*, pas en `Todo`. Deux gardes outillées : `→ Todo` exige un contenu `Approved` (PEF010) ; `→ Validated` exige les AC de la chaîne `Approved` (PEF011).

La priorité est un champ MoSCoW optionnel (`priority: Must | Should | Could | Wont`, DEC-004) ; l'ordre fin reste à l'outil d'exécution (`externalRef`).

## 2. Des Epics depuis la roadmap

```
/draft-epics
```

Propose des Epics (`satisfies` la Roadmap ou un Goal), en `Generated`/`Drafting`, priorité justifiée. Les Epics neufs apparaissent en `epic-without-userstory` dans `pef coverage` : c'est le fil à tirer.

## 3. Des UserStories depuis un Epic

```
/draft-user-stories EPIC-001
```

US au format « En tant que… », `refines` l'Epic, avec leurs AC (rattachées à la Spec quand elle existe, à l'US sinon). Les zones sans Specification sont **signalées, pas inventées**.

## 4. Qualifier un bug

```
/qualify-bug
> "Un client en double a été créé hier avec MARIE@exemple.fr alors que marie@exemple.fr existait"
```

Le Processor reformule (observé vs attendu), identifie les Assets défaillants (`impacts: [SPEC-001, BR-001]`), et propose le test de non-régression (`dependsOn: [TC-003]`). Voir `BUG-001` dans l'exemple. Subtilité assumée : si le comportement observé est **conforme** aux Assets, le défaut est dans la spec — le Processor doit le dire.

## 5. Raffiner avant d'engager

```
/refine-work-item US-001
```

Sortie : un **rapport**, aucun Asset créé ni modifié (EF-20) — ambiguïtés, AC manquants, règles métier absentes, dépendances, taille, questions ouvertes, et une recommandation : prêt pour `Todo`, à découper, ou à compléter. La décision reste au PO.

## 6. Suivre la réalisation

```bash
# le contenu est approuvé, le travail peut commencer
workflowState: Drafting -> Todo        # exige status: Approved (PEF010)
Todo -> InProgress
InProgress -> Validated                # exige les AC de la chaîne Approved (PEF011)
```

Contrôle : `npm run pef -- validate --since origin/main` (la CI le fait sur chaque PR). La couverture surveille en continu :

- `workitem-validated-without-testcase` — validé sans preuve ;
- `workitem-inprogress-upstream-draft` — le sol bouge sous un travail en cours ;
- `bug-without-regression-test` — bug sans filet.

## 7. Signaler à l'équipe

```bash
npm run pef -- signal --apply
```

Chaque écart devient une issue GitHub étiquetée, fermée automatiquement quand l'écart disparaît.
