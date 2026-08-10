---
pefVersion: "0.1"
assetType: BusinessRule
id: BR-001
title: L'adresse email d'un client est unique dans le référentiel
status: Approved
version: 1.0.0
refines: [US-001]
---

# L'adresse email d'un client est unique dans le référentiel

Deux clients ne peuvent pas partager la même adresse email (comparaison insensible à la casse). L'email est l'identifiant naturel du client pour la détection de doublons.
