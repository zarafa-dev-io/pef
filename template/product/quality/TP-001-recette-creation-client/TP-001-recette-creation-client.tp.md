---
pefVersion: "0.1"
assetType: TestPlan
id: TP-001
title: Plan de recette — création d'une fiche client
status: Approved
version: 1.0.0
verifies: [SPEC-001]
---

# Plan de recette — création d'une fiche client

## Périmètre

Création d'une fiche client (SPEC-001) : cas nominal, contrôles de format et unicité de l'email (BR-001).

## Stratégie

- Tests fonctionnels manuels au MVP, dérivés des AcceptanceCriteria AC-001 et AC-002 ;
- données de test indépendantes par cas (pas d'état partagé) ;
- couverture : chaque AC est vérifiée par au moins un TestCase.

## Cas couverts

| TestCase | Vérifie | Type |
|---|---|---|
| TC-001 | AC-001 | Nominal |
| TC-002 | AC-002 | Erreur — format |
| TC-003 | AC-002 | Erreur — doublon |
