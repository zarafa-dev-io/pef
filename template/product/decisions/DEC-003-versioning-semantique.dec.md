---
pefVersion: "0.1"
assetType: Decision
id: DEC-003
title: Sémantique du versioning des Assets et non-invalidation automatique de l'aval
status: Approved
version: 1.0.0
ai:
  generated: true
  processor: Claude
  reviewed: true
  reviewedBy: ROLE-PO
  reviewedAt: "2026-08-10"
---

# Sémantique du versioning des Assets et non-invalidation automatique de l'aval

## Contexte

Tranche QO-2 du PRD. Chaque Asset porte une `version` semver ; sans sémantique partagée, impossible de raisonner sur la péremption des Assets aval (specs revues, tests à rejouer, documentation à rafraîchir — EF-28).

## Décision

1. **PATCH** (`x.y.Z`) — changement de forme : typo, reformulation, mise en page, sans changement de sens. Les Assets aval ne sont pas concernés.
2. **MINEUR** (`x.Y.0`) — ajout ou précision **compatible** : nouveau cas couvert, détail ajouté, exemple. L'aval reste valide ; revue facultative.
3. **MAJEUR** (`X.0.0`) — le **sens change** : comportement, règle, périmètre modifié ou supprimé. Les Assets aval (relations entrantes `satisfies`, `refines`, `verifies`, `dependsOn`, `documents`) doivent être revus.
4. **Aucune invalidation automatique** : un bump majeur amont ne modifie jamais le statut d'un Asset aval. L'outillage **détecte et signale** (issues EF-33) ; l'humain décide de repasser l'aval en `Draft`/`Review`. Le CLI ne réécrit aucun Asset.

## Conséquences

- Cohérent avec Human in the Loop et NFR-1 : l'outillage reste en lecture seule sur les Assets.
- La détection outillée de péremption exige de mémoriser la version amont au moment de l'approbation de l'aval — mécanisme à introduire à partir du lot 2 ; d'ici là, `pef impact <ID>` donne la liste des Assets à examiner après une modification.
- Le choix du niveau de bump est un acte de rédaction engageant : en cas de doute entre mineur et majeur, choisir majeur.
