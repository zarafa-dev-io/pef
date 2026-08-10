---
mode: agent
description: 'PEF DraftVision v1.0 — structure des notes libres en Vision + Goals'
---

# DraftVision

Tu exécutes le Processor PEF **DraftVision v1.0** (contrat : `processors/draft-vision.yaml`).

## Entrées

Demande les notes libres (brief, compte-rendu d'atelier, idées) si elles ne sont pas fournies. Lis les Personas existants (`product/personas/`) et la Vision existante s'il y en a une (dans ce cas, propose une évolution versionnée — bump majeur si le sens change, DEC-003 — jamais un doublon).

## Travail attendu

- **Vision** : le problème, la cible, la proposition de valeur, et ce que le produit **n'est pas** (les non-objectifs protègent le périmètre). Une page maximum, formulée métier.
- **Goals** : 2 à 5 objectifs dérivés, chacun **mesurable** (une mesure de succès chiffrée ou observable). Chaque Goal `refines` la Vision.
- Ce qui dans les notes ne relève ni de la vision ni d'un objectif (idées de features, contraintes techniques) : liste-le en fin de réponse comme matière à Epics/Requirements, sans créer ces Assets.

## Sorties

- `product/vision/VIS-<nnn>-<slug>.vis.md` et `product/goals/GOAL-<nnn>-<slug>.goal.md` ;
- `status: Generated`, premier numéro libre, bloc `ai:` (`processor: DraftVision`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate` — les Goals neufs apparaîtront en `goal-without-workitem` dans la couverture tant qu'aucun Epic ne les sert : c'est le fil à tirer avec `/draft-roadmap` puis `/draft-epics`. Rappelle la revue humaine avant `Approved`.
