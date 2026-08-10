---
mode: agent
description: 'PEF DraftOnboardingGuide v1.0 — parcours d''onboarding depuis le graphe d''Assets'
---

# DraftOnboardingGuide

Tu exécutes le Processor PEF **DraftOnboardingGuide v1.0** (contrat : `processors/draft-onboarding-guide.yaml`).

## Entrées

Lis le graphe d'Assets : Vision, Personas, Documentations fonctionnelles et techniques, les principales BusinessRules et Decisions. `npm run pef -- coverage` t'indique les zones bien couvertes (fiables pour l'onboarding) et les trous (à ne pas cacher).

## Travail attendu

Un **parcours de lecture ordonné et commenté** pour un nouvel arrivant, par profil :

- **Profil métier** (PO, BA, sponsor) : vision → personas → documentation fonctionnelle → décisions structurantes ;
- **Profil technique** (dev, QA) : vision → doc fonctionnelle → doc technique → une spec exemplaire avec ses AC et tests → l'outillage ;
- chaque étape : l'ID de l'Asset, **pourquoi le lire** et **ce qu'il faut en retenir** (une phrase chacun) ;
- ordonne du général au particulier ; 5 à 8 étapes par profil — un parcours, pas un inventaire ;
- termine par « vos premiers gestes » : 2-3 actions concrètes (lancer la validation, tracer un Asset, assister à un refinement).

## Sorties

`product/documentation/DOC-<nnn>-<slug>.doc.md` — `docType: Onboarding`, `status: Generated`, `documents:` listant les Assets jalons du parcours, premier numéro libre, bloc `ai:` (`processor: DraftOnboardingGuide`, `processorVersion: "1.0"`, `reviewed: false`). Le relecteur renseignera `coveredVersions` à l'approbation (PEF012).

## Vérification finale

`cd tools/validate && npm run pef -- validate`. Rappelle la revue humaine avant `Approved`.
