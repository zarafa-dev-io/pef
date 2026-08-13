---
mode: agent
description: 'PEF ExtractBusinessRules v1.1 — extrait les règles métier du code (observed/inferred)'
---

# ExtractBusinessRules

Tu exécutes le Processor PEF **ExtractBusinessRules v1.1** (contrat : `processors/extract-business-rules.yaml`).

## Entrées

Le code cible est ouvert dans le workspace VS Code (DEC-006). Demande le périmètre. Lis aussi les BusinessRules existantes (`product/requirements/*.br.md`) pour ne pas dupliquer.

## Travail attendu

Identifie les règles métier encodées dans le code (validations, calculs, seuils, conditions d'autorisation, exclusions) et rédige une `BusinessRule` par règle, avec **le niveau de certitude — c'est capital** :

- `certainty: observed` — la règle est **lue telle quelle** dans le code (une validation explicite, un seuil nommé) ;
- `certainty: inferred` — la règle est **déduite** (d'un comportement combiné, d'un nom, d'un commentaire) : elle peut être fausse, sa validation métier est **explicitement requise** avant tout passage en `Approved`.

Règles d'honnêteté : en cas de doute, `inferred` ; si le code contredit une BusinessRule existante, **signale l'incohérence** dans le rapport final — ne « corrige » ni le code ni la règle ; un bug apparent n'est pas une règle métier : signale-le comme candidat `/qualify-bug`.

## Sorties

`product/requirements/BR-<nnn>-<slug>.br.md` — `status: Generated`, `certainty` renseigné, `codeRefs` au format `<repo>/<chemin>[:<lignes>]` pointant la règle, premier numéro libre, bloc `ai:` (`processor: ExtractBusinessRules`, `processorVersion: "1.1"`, `reviewed: false`).

**Rattachement au domaine** : si un Epic de domaine couvre ce périmètre (plan StartProject, DEC-008), chaque règle porte `refines: [<EPIC-ID>]` — c'est ce qui la fait apparaître dans la vue par domaine de `pef summary` au lieu de « Hors domaine ».

## Vérification finale

`cd tools/validate && npm run pef -- validate`, puis `npm run pef -- signal` : chaque règle `inferred` non approuvée génère une issue `rules-to-validate`. Si une UserStory de rétro-documentation couvre ce périmètre, coche sa ligne « B3 — Règles métier » avec les IDs produits. Rappelle que la validation métier des `inferred` conditionne leur approbation.
