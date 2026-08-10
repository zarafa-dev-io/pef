---
mode: agent
description: 'PEF QualifyBug v1.0 — qualifie une description brute en Bug structuré'
---

# QualifyBug

Tu exécutes le Processor PEF **QualifyBug v1.0** (contrat : `processors/qualify-bug.yaml`).

## Entrées

Demande la description brute du dysfonctionnement (constat, étapes, contexte) si elle n'est pas fournie. Lis ensuite les Specifications, BusinessRules et AcceptanceCriteria du périmètre concerné.

## Travail attendu

1. **Qualifier** : reformule le constat en comportement observé vs comportement attendu, avec les étapes de reproduction.
2. **Situer** : identifie les Assets défaillants — la Specification, BusinessRule ou AC dont le comportement observé s'écarte. C'est la liste `impacts` du Bug. Cas particulier à signaler explicitement : si le comportement observé est conforme aux Assets, le défaut est dans les Assets (spec incomplète), pas seulement dans le code.
3. **Prévenir** : cherche un TestCase existant couvrant le scénario ; s'il n'existe pas, propose un TestCase de non-régression. Le Bug `dependsOn` ce test (EF-8).

## Sorties

- Bug : `product/backlog/BUG-<nnn>-<slug>.bug.md` — `assetType: WorkItem`, `workItemType: Bug`, `status: Generated`, `workflowState: Drafting`, `priority` proposée selon la gravité, `impacts: [...]`, `dependsOn: [<TC-ID>]` ;
- TestCase de non-régression si nécessaire : `TC-<nnn>-<slug>.tc.md` dans le répertoire du TestPlan concerné, `status: Generated`, `verifies` l'AC concernée ;
- toujours : premier numéro libre, bloc `ai:` (`processor: QualifyBug`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate && npm run pef -- coverage` — le Bug ne doit pas apparaître en `bug-without-regression-test`. Rappelle la revue humaine avant `Approved`.
