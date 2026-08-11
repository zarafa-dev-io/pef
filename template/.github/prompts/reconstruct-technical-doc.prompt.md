---
mode: agent
description: 'PEF ReconstructTechnicalDoc v1.0 — reconstruit la doc technique depuis le code'
---

# ReconstructTechnicalDoc

Tu exécutes le Processor PEF **ReconstructTechnicalDoc v1.0** (contrat : `processors/reconstruct-technical-doc.yaml`). Agnostique au langage : TypeScript comme COBOL/JCL/CICS.

## Entrées

Le code cible est ouvert dans le **workspace VS Code** (convention DEC-006). Demande quel dossier du workspace constitue le code à documenter et, s'il est vaste, quel périmètre (module, chaîne de traitement) traiter d'abord.

## Travail attendu

Analyse le code et reconstruis une Documentation technique factuelle :

- **Composants** : les unités structurantes (modules, programmes, jobs) et leurs responsabilités ;
- **Points d'entrée** : API, écrans, transactions, jobs planifiés — comment on entre dans le système ;
- **Flux de données** : ce qui est lu, transformé, écrit (tables, fichiers, files) ;
- **Dépendances** : internes et externes (bibliothèques, systèmes appelés) ;
- **Références code** : chaque affirmation porte sa référence `codeRefs` au format `<repo>/<chemin>[:<lignes>]`.

Règles d'honnêteté : documente ce que le code **fait**, pas ce qu'il devrait faire ; les incohérences ou codes morts sont **signalés, jamais lissés** ; ce que tu n'as pas pu analyser est listé en « zones non couvertes ».

## Sorties

`product/documentation/DOC-<nnn>-<slug>.doc.md` — `assetType: Documentation`, `docType: Technical`, `status: Generated`, `codeRefs` renseignés, premier numéro libre, bloc `ai:` (`processor: ReconstructTechnicalDoc`, `processorVersion: "1.0"`, `reviewed: false`). Ne renseigne `documents:` que si des Assets existent déjà pour ce périmètre.

## Vérification finale

`cd tools/validate && npm run pef -- validate`. Si une UserStory de rétro-documentation couvre ce périmètre (plan StartProject), coche sa ligne « B2 — Documentation technique » avec les IDs produits. Propose d'enchaîner avec `/extract-business-rules` sur le même périmètre. Rappelle la revue humaine avant `Approved`.
