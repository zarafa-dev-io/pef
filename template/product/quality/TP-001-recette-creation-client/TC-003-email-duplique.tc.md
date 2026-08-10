---
pefVersion: "0.1"
assetType: TestCase
id: TC-003
title: Rejeter un email déjà connu (insensible à la casse)
status: Approved
version: 1.0.0
refines: [TP-001]
verifies: [AC-002]
---

# Rejeter un email déjà connu (insensible à la casse)

## Préconditions

Un client existant avec l'email `marie@exemple.fr`.

## Étapes

1. Ouvrir « Nouveau client ».
2. Saisir nom `M. Durand`, email `MARIE@exemple.fr`.
3. Valider.

## Résultat attendu

La fiche n'est pas créée ; le message « Un client avec cette adresse existe déjà. » est affiché et propose d'ouvrir la fiche existante.
