---
pefVersion: "0.1"
assetType: TestCase
id: TC-002
title: Rejeter un email au format invalide
status: Approved
version: 1.0.0
refines: [TP-001]
verifies: [AC-002]
---

# Rejeter un email au format invalide

## Étapes

1. Ouvrir « Nouveau client ».
2. Saisir nom `Paul Martin`, email `paul[at]exemple`.
3. Valider.

## Résultat attendu

La fiche n'est pas créée ; le message « L'adresse email n'est pas valide. » est affiché sur le champ email.
