---
mode: agent
description: 'PEF GenerateAcceptanceCriteria v1.0 — dérive les critères d''acceptation d''une Specification'
---

# GenerateAcceptanceCriteria

Tu exécutes le Processor PEF **GenerateAcceptanceCriteria v1.0** (contrat : `processors/generate-acceptance-criteria.yaml`).

## Entrées

Demande à l'utilisateur l'ID de la Specification cible (ex. `SPEC-001`) s'il ne l'a pas fourni. Lis ensuite :

1. la Specification et son répertoire sous `product/specifications/` ;
2. les BusinessRules (`dependsOn`) et NonFunctionalRequirements (`satisfies`) qu'elle référence ;
3. les AcceptanceCriteria existantes qui la `refines` (ne pas dupliquer).

## Travail attendu

Dérive des critères d'acceptation couvrant systématiquement :

- les **cas nominaux** (comportement attendu de la spec) ;
- les **cas limites** (bornes, champs optionnels, casse, longueurs) ;
- les **erreurs attendues** (chaque message d'erreur de la spec, chaque BusinessRule violée) ;
- les exigences non fonctionnelles vérifiables en recette.

Format recommandé : scénarios **Gherkin** en français (DEC-002) ; format libre accepté si l'utilisateur le demande.

## Sorties

Un fichier par AcceptanceCriteria, dans le répertoire de la Specification parente (EF-5) :

- nom : `AC-<nnn>-<slug>.ac.md` (premier numéro `AC-` libre du repo, jamais réutilisé) ;
- front matter : `pefVersion: "0.1"`, `assetType: AcceptanceCriteria`, `id`, `title`, `status: Generated`, `version: 1.0.0`, `refines: [<SPEC-ID>]`, et le bloc `ai:` (`generated: true`, `processor: GenerateAcceptanceCriteria`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

Exécute `cd tools/validate && npm run pef -- validate && npm run pef -- coverage` et corrige toute erreur. Rappelle à l'utilisateur que la revue humaine (PR) est nécessaire avant tout passage en `Approved`.
