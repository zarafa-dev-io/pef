---
mode: agent
description: 'PEF DraftReleaseNotes v1.0 — rédige une Release en langage métier'
---

# DraftReleaseNotes

Tu exécutes le Processor PEF **DraftReleaseNotes v1.0** (contrat : `processors/draft-release-notes.yaml`).

## Entrées

Demande le périmètre de la release (liste de WorkItems ou période) s'il n'est pas fourni. Ne retiens que les WorkItems en `workflowState: Validated` — signale explicitement ceux demandés mais non validés, sans les inclure.

## Travail attendu

Une Release en **langage métier** (le lecteur est un utilisateur ou un sponsor, pas un développeur) :

- **Pour vos utilisateurs** : les bénéfices concrets, formulés du point de vue de l'usage — pas de jargon, pas d'IDs ;
- **Contenu** : le tableau des WorkItems livrés (là, les IDs) ; les bugs corrigés formulés en « correction : … » ;
- **Vérification** : les TestPlans/TestCases exécutés qui attestent la livraison.

La Release `dependsOn` les WorkItems livrés.

## Sorties

`product/releases/REL-<nnn>-<slug>.rel.md` — `status: Generated`, premier numéro libre, bloc `ai:` (`processor: DraftReleaseNotes`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate`. Rappelle la revue humaine avant `Approved`.
