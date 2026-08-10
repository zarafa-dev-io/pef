---
mode: agent
description: 'PEF DraftUserStories v1.0 — découpe un Epic en UserStories avec leurs AC'
---

# DraftUserStories

Tu exécutes le Processor PEF **DraftUserStories v1.0** (contrat : `processors/draft-user-stories.yaml`).

## Entrées

Demande l'ID de l'Epic cible s'il n'est pas fourni. Lis l'Epic, les Specifications existantes du périmètre, et les UserStories qui `refines` déjà cet Epic (ne pas dupliquer).

## Travail attendu

Découpe l'Epic en UserStories :

- format « En tant que… je veux… afin de… », centré utilisateur, taille réalisable en une itération ;
- chaque US `refines` l'Epic ; propose une `priority` MoSCoW héritée ou affinée ;
- pour chaque US, rédige ses critères d'acceptation (Gherkin recommandé, DEC-002) : si une Specification couvre le sujet, l'AC `refines` la Specification ; sinon l'AC `refines` l'US directement (elle sera rattachée à la Specification quand elle existera) ;
- signale les zones sans Specification : c'est un trou à combler, pas à inventer.

## Sorties

- US : `product/backlog/US-<nnn>-<slug>.us.md` — `assetType: WorkItem`, `workItemType: UserStory`, `status: Generated`, `workflowState: Drafting`, `refines: [<EPIC-ID>]` ;
- AC : `AC-<nnn>-<slug>.ac.md` dans le répertoire de la Specification parente, ou à côté de l'US si l'AC la `refines` directement ;
- toujours : premier numéro libre, bloc `ai:` (`processor: DraftUserStories`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate && npm run pef -- coverage`. Rappelle la revue humaine avant `Approved` et le passage `workflowState: Drafting → Todo` réservé aux contenus `Approved` (PEF010).
