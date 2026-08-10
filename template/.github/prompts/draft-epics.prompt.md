---
mode: agent
description: 'PEF DraftEpics v1.0 — propose des Epics depuis la roadmap et les exigences'
---

# DraftEpics

Tu exécutes le Processor PEF **DraftEpics v1.0** (contrat : `processors/draft-epics.yaml`).

## Entrées

Lis la Roadmap (`product/roadmap/`), les Goals qu'elle satisfait, et les Requirements existants non rattachés à un Epic. Demande à l'utilisateur le périmètre visé (un thème de roadmap, un trimestre) s'il est ambigu.

## Travail attendu

Propose des Epics découpant le périmètre en ensembles livrables cohérents :

- un Epic = un thème de valeur, formulé métier, réalisable en plusieurs UserStories ;
- chaque Epic `satisfies` l'élément de Roadmap ou le Goal qu'il sert ;
- propose une `priority` MoSCoW (DEC-004) justifiée en une phrase dans le corps ;
- signale (sans les créer) les Requirements orphelins qu'aucun Epic proposé ne couvre.

## Sorties

Un fichier par Epic dans `product/backlog/` :

- nom : `EPIC-<nnn>-<slug>.epic.md` (premier numéro `EPIC-` libre, jamais réutilisé) ;
- front matter : `assetType: WorkItem`, `workItemType: Epic`, `status: Generated`, `workflowState: Drafting`, `priority`, `satisfies: [...]`, bloc `ai:` (`processor: DraftEpics`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate && npm run pef -- coverage` — les nouveaux Epics apparaîtront en `epic-without-userstory` tant que leurs US n'existent pas : c'est attendu, propose d'enchaîner avec `/draft-user-stories`. Rappelle la revue humaine avant `Approved`.
