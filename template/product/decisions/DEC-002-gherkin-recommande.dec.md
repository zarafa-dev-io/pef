---
pefVersion: "0.1"
assetType: Decision
id: DEC-002
title: Gherkin recommandé mais non obligatoire pour les AcceptanceCriteria
status: Approved
version: 1.0.0
ai:
  generated: true
  processor: Claude
  reviewed: true
  reviewedBy: ROLE-PO
  reviewedAt: "2026-08-10"
---

# Gherkin recommandé mais non obligatoire pour les AcceptanceCriteria

## Contexte

Tranche QO-4 du PRD : fallait-il imposer le format Gherkin (Given/When/Then) dans le corps des `AcceptanceCriteria` ?

## Décision

Le format du corps d'un AC est **libre** ; le Gherkin est **recommandé** : les templates et les Processors (`GenerateAcceptanceCriteria`, `GenerateTestCases`) le produisent par défaut. La validation (`pef validate`) ne contrôle que le front matter, jamais le corps.

## Conséquences

- Un AC rédigé en tableau ou en liste reste valide ; l'équipe choisit son formalisme.
- Les Processors de génération de tests savent exploiter le Gherkin en priorité, et le texte libre à défaut.
- Réversible : une règle de validation optionnelle (« Gherkin obligatoire ») pourra être ajoutée par profil si une organisation l'exige.
