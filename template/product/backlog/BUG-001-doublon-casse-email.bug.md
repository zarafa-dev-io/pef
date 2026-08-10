---
pefVersion: "0.1"
assetType: WorkItem
workItemType: Bug
id: BUG-001
title: Doublon créé quand l'email ne diffère que par la casse
status: Approved
version: 1.0.0
priority: Must
workflowState: Validated
impacts: [SPEC-001, BR-001]
dependsOn: [TC-003]
---

# Doublon créé quand l'email ne diffère que par la casse

## Constat

La création d'un client avec `MARIE@exemple.fr` aboutissait alors qu'une fiche `marie@exemple.fr` existait déjà : le contrôle d'unicité comparait les emails sans normaliser la casse.

## Assets impactés

- `SPEC-001` : le contrôle d'unicité doit préciser « insensible à la casse » (fait, v1.0.0) ;
- `BR-001` : la règle d'unicité explicite la comparaison insensible à la casse.

## Test de non-régression

`TC-003` — Rejeter un email déjà connu (insensible à la casse).
