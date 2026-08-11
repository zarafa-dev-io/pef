---
mode: agent
description: 'PEF DraftRegressionTestPlan v1.0 — tests de caractérisation depuis la rétro-doc ou le code'
---

# DraftRegressionTestPlan

Tu exécutes le Processor PEF **DraftRegressionTestPlan v1.0** (contrat : `processors/draft-regression-test-plan.yaml`). Contexte : un existant sans Specification ni AcceptanceCriteria — on **fige le comportement observé** avant toute évolution (tests de caractérisation).

## Entrées

Demande le périmètre (l'ID de la Documentation fonctionnelle, ex. `DOC-002`). Lis :

1. la Documentation fonctionnelle et la Documentation technique qu'elle référence ;
2. les BusinessRules du périmètre, **avec leur niveau de certitude** (`observed` / `inferred`) ;
3. le code lui-même si le workspace l'expose (DEC-006) — pour préciser données de test et cas limites.

## Travail attendu

### Le principe directeur

Tu documentes ce que le système **fait**, pas ce qu'il devrait faire. Un comportement suspect (probable bug) est figé tel quel dans le test **et** signalé en fin de rapport comme candidat `/qualify-bug` — jamais « corrigé » silencieusement dans le résultat attendu.

### Le TestPlan

- **Périmètre** : ce que couvre la caractérisation, ce qu'elle exclut (zones non documentées — les lister, pas les inventer) ;
- **Stratégie** : priorité aux flux critiques et aux règles `Must`, données de test reproductibles, état initial explicite ;
- **Matrice de couverture** : chaque BusinessRule du périmètre → au moins un TestCase ; chaque flux principal de la doc fonctionnelle → un scénario nominal + ses erreurs connues.

### Les TestCases

- un cas = un comportement figé : préconditions précises, étapes rejouables, **résultat observé** (pas « attendu idéalement ») ;
- les cas issus d'une règle `inferred` portent la mention **« à confirmer — règle inférée (BR-xxx) »** : si la validation métier infirme la règle, le test tombe avec elle ;
- cas limites depuis le code quand il est accessible (bornes, valeurs par défaut, casse).

## Relations (convention rétro-doc)

- Le TestPlan `verifies` la **Documentation fonctionnelle** (pas de Specification à ce stade) ;
- chaque TestCase `refines` le TestPlan et `verifies` la **BusinessRule** qu'il fige ;
- quand des Specifications seront écrites plus tard, elles reprendront ces règles et les tests basculeront naturellement dans la chaîne nominale.

## Sorties

`product/quality/TP-<nnn>-<slug>/` avec le plan et ses cas (EF-5) — `status: Generated`, premiers numéros libres, bloc `ai:` (`processor: DraftRegressionTestPlan`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate && npm run pef -- coverage`. Rapport final : couverture règle par règle, comportements suspects à qualifier en bugs, zones non caractérisées. Rappelle la revue humaine avant `Approved`.
