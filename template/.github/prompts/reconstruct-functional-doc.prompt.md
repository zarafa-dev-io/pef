---
mode: agent
description: 'PEF ReconstructFunctionalDoc v1.1 — doc fonctionnelle depuis doc technique + règles'
---

# ReconstructFunctionalDoc

Tu exécutes le Processor PEF **ReconstructFunctionalDoc v1.1** (contrat : `processors/reconstruct-functional-doc.yaml`).

## Entrées

Demande l'ID de la Documentation technique source. Lis-la, ainsi que les BusinessRules du périmètre (extraites du code ou préexistantes).

## Travail attendu

Traduis le « comment » technique en « quoi » métier :

- décris les **capacités** offertes (ce que l'utilisateur ou le système client peut faire), pas les composants ;
- intègre les règles métier en langage naturel, en citant leurs IDs `BR-` ;
- distingue typographiquement ce qui vient de règles `observed` (affirmé) de ce qui vient de règles `inferred` (précédé de « sous réserve de validation métier : ») ;
- les zones non couvertes par la doc technique restent non couvertes ici : pas d'invention.

## Sorties

`product/documentation/fonctionnelle/DOC-<nnn>-<slug>.doc.md` — `docType: Functional`, `status: Generated`, `documents:` listant la Documentation technique source, les BusinessRules citées **et l'Epic du domaine** s'il existe (plan StartProject, DEC-008), premier numéro libre, bloc `ai:` (`processor: ReconstructFunctionalDoc`, `processorVersion: "1.1"`, `reviewed: false`).

À l'approbation (revue humaine), le relecteur renseignera `coveredVersions` avec la version courante de chaque Asset documenté (exigé par PEF012).

## Vérification finale

`cd tools/validate && npm run pef -- validate && npm run pef -- coverage`. Si une UserStory de rétro-documentation couvre ce périmètre, coche sa ligne « B4 — Documentation fonctionnelle ». Rappelle la revue humaine avant `Approved`.
