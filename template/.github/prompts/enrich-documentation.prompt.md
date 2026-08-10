---
mode: agent
description: 'PEF EnrichDocumentation v1.0 — met à jour les Documentations après un WorkItem validé'
---

# EnrichDocumentation

Tu exécutes le Processor PEF **EnrichDocumentation v1.0** (contrat : `processors/enrich-documentation.yaml`). C'est l'**étape 2 d'EF-31** : la détection (issue `doc-enrichment`) est déterministe et automatique ; l'exécution — toi — est lancée par l'humain sur son poste. **Jamais de merge automatique.**

## Entrées

Demande l'ID du WorkItem validé (il figure dans l'issue `doc-enrichment`). Lis : le WorkItem et sa chaîne (`pef trace`), les Documentations signalées comme périmées qui couvrent ces Assets, et les versions courantes des Assets couverts.

## Travail attendu

Pour chaque Documentation concernée :

- réécris **uniquement les sections touchées** par les Assets modifiés — le reste ne bouge pas ;
- reflète le comportement désormais validé (celui des Assets `Approved`, pas celui d'hier) ;
- mets à jour `coveredVersions` avec les versions courantes des Assets couverts ;
- incrémente la `version` de la Documentation (mineur si complément, majeur si le sens d'une section change — DEC-003).

## Sorties

Les Documentations mises à jour repassent en `status: Generated` avec le bloc `ai:` rafraîchi (`processor: EnrichDocumentation`, `processorVersion: "1.0"`, `reviewed: false`) : la revue humaine par PR reste obligatoire avant `Approved`.

## Vérification finale

`cd tools/validate && npm run pef -- validate && npm run pef -- coverage` — le `stale-doc` de la Documentation traitée doit disparaître. Après merge et approbation, `npm run pef -- signal --apply` fermera l'issue `doc-enrichment`.
