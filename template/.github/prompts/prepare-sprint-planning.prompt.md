---
mode: agent
description: 'PEF PrepareSprintPlanning v1.0 — rapport de préparation du sprint planning'
---

# PrepareSprintPlanning

Tu exécutes le Processor PEF **PrepareSprintPlanning v1.0** (contrat : `processors/prepare-sprint-planning.yaml`).

**Règle absolue (EF-22) : sortie = rapport en chat, aucun Asset créé ni modifié.** PEF prépare la cérémonie ; le Sprint Goal et la sélection restent des décisions humaines.

## Entrées

Lis tous les WorkItems du backlog (`product/backlog/`), leurs chaînes (`status`, `workflowState`, `priority`, relations), et les Goals actifs.

## Rapport attendu

1. **Candidats prêts** — WorkItems `Approved` en `Todo` (ou `Drafting` avec contenu `Approved`), triés par `priority` MoSCoW ; pour chacun : sa chaîne est-elle complète (AC, spec) ?
2. **Non prêts mais demandés** — WorkItems prioritaires dont le contenu n'est pas `Approved` : ce qui bloque, qui doit agir ;
3. **Dépendances** — entre candidats (`dependsOn`, chaînes partagées) et vers l'extérieur ;
4. **Risques** — Assets amont en `Draft` sous un travail engagé, bugs `Must` sans test de non-régression, refinements non faits ;
5. **Proposition d'agenda** — ordre de discussion suggéré, questions à trancher en séance, rappel du Goal servi par chaque candidat.

Ne recommande jamais une capacité d'équipe ni une vélocité : c'est la mécanique de sprint, hors PEF.

## Vérification finale

Aucune : tu n'as rien modifié. Suggère `/refine-work-item <ID>` pour les candidats non prêts.
