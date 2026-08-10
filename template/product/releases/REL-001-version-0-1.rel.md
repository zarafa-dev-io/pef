---
pefVersion: "0.1"
assetType: Release
id: REL-001
title: Release 0.1 — création de fiches clients fiable
status: Approved
version: 1.0.0
dependsOn: [US-001, BUG-001]
---

# Release 0.1 — création de fiches clients fiable

## Pour vos utilisateurs

Vous pouvez créer vos fiches clients : nom, email, téléphone. Clientis refuse les adresses invalides et détecte les doublons — y compris quand la casse diffère (`MARIE@` = `marie@`).

## Contenu

| WorkItem | Description |
|---|---|
| US-001 | Créer une fiche client |
| BUG-001 | Correction : doublon possible quand l'email ne différait que par la casse |

## Vérification

Recette TP-001 exécutée : TC-001, TC-002, TC-003 passés.
