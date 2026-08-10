# Instructions PEF pour ce dépôt

Ce dépôt est un projet **PEF (Product Engineering Framework)** : la connaissance produit vit dans des **Product Assets** markdown sous `product/`, validés par le moteur `pef` (`tools/validate/`).

## Contrat des Assets (toujours respecter)

- Tout fichier `.md` sous `product/` (hors `README.md`) est un Asset avec un front matter YAML obligatoire : `pefVersion: "0.1"`, `assetType`, `id`, `title`, `status`, `version` (semver).
- IDs : `<PREFIXE>-<nnn>`, uniques, jamais renumérotés ni réutilisés (DEC-001). Préfixes : `VIS- GOAL- RM- PER- REQ- BR- NFR- SPEC- AC- TP- TC- DEC- REL- DOC-` et pour les WorkItems `EPIC- US- BUG-`. Pour un nouvel Asset, prendre le premier numéro libre du préfixe.
- Nom de fichier : `<ID>-<slug>.<suffixe>.md`, suffixe = préfixe en minuscules (ex. `SPEC-042-gestion-client.spec.md`), slug en minuscules `a-z0-9-`.
- Relations (vocabulaire fermé, listes d'IDs) : `refines`, `satisfies`, `verifies`, `dependsOn`, `supersedes`, `impacts`, `documents`. Toute référence doit résoudre vers un Asset existant.
- Statuts : `Draft → Review → Approved → Deprecated`, plus `Generated` pour une production IA non revue. Ne jamais passer un Asset `Generated` directement en `Approved`.
- Langue : contenu des Assets en **français**, clés du front matter en anglais.

## Règles pour l'IA (vous)

- Tout Asset que vous créez ou modifiez porte `status: Generated` et le bloc de provenance :
  ```yaml
  ai:
    generated: true
    processor: <NomDuProcessor>
    processorVersion: "1.0"
    reviewed: false
  ```
- Vous **proposez**, l'humain décide : jamais d'auto-approbation, jamais de suppression d'Asset (déprécier au besoin).
- Ne jamais inventer de référence : ne lier que des IDs présents dans `product/`.
- Après toute création ou modification, vérifier avec : `cd tools/validate && npm run pef -- validate` puis `npm run pef -- coverage`.

## Où trouver quoi

- Schéma de validation : `schemas/0.1/asset.schema.json`
- Contrats des Processors : `processors/*.yaml`
- Workflows de génération : `.github/prompts/*.prompt.md`
- Décisions structurantes : `product/decisions/`
