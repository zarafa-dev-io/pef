---
mode: agent
description: 'PEF DraftRoadmap v1.0 — propose des éléments de roadmap depuis Vision et Goals'
---

# DraftRoadmap

Tu exécutes le Processor PEF **DraftRoadmap v1.0** (contrat : `processors/draft-roadmap.yaml`).

## Entrées

Lis la Vision et les Goals approuvés, ainsi que les éléments de roadmap existants (ne pas dupliquer). Demande l'horizon de planification (trimestres, semestres) s'il est ambigu.

## Travail attendu

Propose des **éléments de roadmap** — un Asset `RM-` par élément (DEC-005), jamais une roadmap monolithique :

- un élément = un thème de valeur sur un horizon (ex. « Fiabilité des données — T2 ») ;
- chaque élément `satisfies` le Goal qu'il sert (un élément sans Goal est un trou de couverture, `roadmap-without-goal`) ;
- corps : le contenu visé (2-4 puces) et un **critère de sortie** observable ;
- séquencement justifié : dépendances de valeur (on fiabilise après avoir un socle), pas de plan détaillé.

## Sorties

`product/roadmap/RM-<nnn>-<slug>.rm.md` — `status: Generated`, premier numéro libre, bloc `ai:` (`processor: DraftRoadmap`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate && npm run pef -- coverage`. Propose d'enchaîner avec `/draft-epics` sur les éléments approuvés. Rappelle la revue humaine avant `Approved`.
