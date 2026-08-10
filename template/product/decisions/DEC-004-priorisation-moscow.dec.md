---
pefVersion: "0.1"
assetType: Decision
id: DEC-004
title: Priorisation des WorkItems par champ MoSCoW, ordonnancement fin hors PEF
status: Review
version: 1.0.0
ai:
  generated: true
  processor: Claude
  reviewed: false
---

# Priorisation des WorkItems par champ MoSCoW, ordonnancement fin hors PEF

## Contexte

Tranche QO-6 du PRD. La priorité pouvait vivre dans un champ de front matter, dans un Asset `Backlog` dédié portant l'ordre total, ou rester dans l'outil d'exécution (Jira).

## Décision

1. Les WorkItems portent un champ optionnel **`priority: Must | Should | Could | Wont`** (MoSCoW), versionné avec l'Asset et exploitable par les Processors (refinement, sprint planning).
2. **L'ordonnancement fin (ordre total) reste à l'outil d'exécution**, relié par `externalRef` — cohérent avec l'exclusion « mécanique de sprint » du PRD.
3. Pas d'Asset `Backlog` dédié : un fichier d'ordre total serait le point de conflit permanent du repo et dupliquerait l'outil d'exécution.

## Conséquences

- Le schéma n'autorise `priority` que sur les WorkItems ; l'absence de priorité est valide (backlog non trié n'est pas une erreur).
- Les Processors (`DraftEpics`, `DraftUserStories`, `QualifyBug`) proposent une priorité justifiée ; le PO la confirme en revue.
- Réversible : si l'usage révèle le besoin d'un ordre total versionné, un Asset dédié pourra être introduit par une Decision qui `supersedes` celle-ci.
