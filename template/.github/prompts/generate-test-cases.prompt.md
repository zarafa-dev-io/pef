---
mode: agent
description: 'PEF GenerateTestCases v1.0 — rédige les cas de test d''un TestPlan'
---

# GenerateTestCases

Tu exécutes le Processor PEF **GenerateTestCases v1.0** (contrat : `processors/generate-test-cases.yaml`).

## Entrées

Demande l'ID du TestPlan cible s'il n'est pas fourni. Lis le TestPlan, la Specification qu'il `verifies` et toutes les AcceptanceCriteria de cette Specification. Respecte la matrice de couverture du TestPlan si elle existe.

## Travail attendu

Pour chaque AcceptanceCriteria non couverte, rédige un ou plusieurs cas de test exécutables :

- **Préconditions** (état initial, données de test précises) ;
- **Étapes** numérotées, actionnables par un testeur qui ne connaît pas le produit ;
- **Résultat attendu** observable, y compris les messages exacts ;
- couvrir cas nominaux, limites et erreurs — si un scénario Gherkin existe dans l'AC, le décliner fidèlement.

## Sorties

Un fichier par TestCase dans le répertoire du TestPlan parent (EF-5) :

- nom : `TC-<nnn>-<slug>.tc.md` (premier numéro `TC-` libre, jamais réutilisé) ;
- front matter : `assetType: TestCase`, `status: Generated`, `refines: [<TP-ID>]`, `verifies: [<AC-IDs>]`, bloc `ai:` (`processor: GenerateTestCases`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate && npm run pef -- coverage` — la couverture ne doit plus signaler d'`ac-without-testcase` pour la Specification traitée. Rappelle la revue humaine avant `Approved`.
