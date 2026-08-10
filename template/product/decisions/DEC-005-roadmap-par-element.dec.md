---
pefVersion: "0.1"
assetType: Decision
id: DEC-005
title: La Roadmap est un Asset par élément, pas un document monolithique
status: Review
version: 1.0.0
impacts: [RM-001]
ai:
  generated: true
  processor: Claude
  reviewed: false
---

# La Roadmap est un Asset par élément, pas un document monolithique

## Contexte

Tranche QO-7 du PRD. Une roadmap unique versionnée est plus simple à maintenir, mais ses éléments ne sont pas adressables : impossible de rattacher un Epic à un élément précis, ou de contrôler « élément sans Goal » (EF-12).

## Décision

1. Chaque élément de roadmap (**un thème de valeur sur un horizon**) est un Asset `RM-` autonome : titre daté, contenu visé, **critère de sortie observable**.
2. Chaque élément `satisfies` le Goal qu'il sert ; les Epics `satisfies` l'élément précis qui les motive.
3. La vue d'ensemble est le répertoire `product/roadmap/` (et les rapports des Processors) — pas un Asset agrégateur.

## Conséquences

- La couverture contrôle `roadmap-without-goal` (élément orphelin de Goal) et `goal-without-workitem` (Goal jamais servi) ;
- re-prioriser = éditer un petit fichier par élément (pas de conflit permanent sur un document central) ;
- la roadmap monolithique RM-001 v1 a été découpée : RM-001 v2.0.0 (bump majeur, DEC-003) ne porte plus que l'élément « Socle ».
