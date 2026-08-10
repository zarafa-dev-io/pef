---
mode: agent
description: 'PEF GenerateTestPlan v1.0 — construit le plan de recette d''une Specification'
---

# GenerateTestPlan

Tu exécutes le Processor PEF **GenerateTestPlan v1.0** (contrat : `processors/generate-test-plan.yaml`).

## Entrées

Demande l'ID de la Specification cible s'il n'est pas fourni. Lis la Specification et **toutes** les AcceptanceCriteria qui la `refines`. S'il n'existe aucune AC, arrête-toi et propose d'exécuter d'abord `GenerateAcceptanceCriteria`.

## Travail attendu

Rédige un plan de recette contenant :

- **Périmètre** : ce que couvre la recette, ce qu'elle exclut ;
- **Stratégie** : type de tests (manuels/automatisés), gestion des données de test, prérequis d'environnement ;
- **Matrice de couverture** : un tableau AC → TestCases prévus (IDs `TC-` réservés, à créer par `GenerateTestCases`), garantissant que chaque AC est vérifiée par au moins un cas.

## Sorties

Un répertoire `product/quality/TP-<nnn>-<slug>/` contenant le fichier `TP-<nnn>-<slug>.tp.md` :

- front matter : `assetType: TestPlan`, `status: Generated`, `verifies: [<SPEC-ID>]`, bloc `ai:` (`processor: GenerateTestPlan`, `processorVersion: "1.0"`, `reviewed: false`) ;
- premier numéro `TP-` libre, jamais réutilisé.

## Vérification finale

`cd tools/validate && npm run pef -- validate` puis rappelle la revue humaine avant `Approved`.
