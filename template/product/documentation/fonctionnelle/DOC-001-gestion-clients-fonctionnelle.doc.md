---
pefVersion: "0.1"
assetType: Documentation
docType: Functional
id: DOC-001
title: Documentation fonctionnelle — gestion des fiches clients
status: Approved
version: 1.0.0
documents: [SPEC-001, BR-001]
coveredVersions:
  SPEC-001: "1.0.0"
  BR-001: "1.0.0"
---

# Documentation fonctionnelle — gestion des fiches clients

> Couvre SPEC-001 (création d'une fiche client) et BR-001 (unicité de l'email). Les versions couvertes sont mémorisées dans `coveredVersions` : si un Asset couvert évolue, cette documentation est signalée comme périmée (`stale-doc`).

## Créer un client

L'utilisateur saisit le nom (obligatoire), l'email (obligatoire) et le téléphone (facultatif). L'application refuse :

- un email mal formé — message : « L'adresse email n'est pas valide. » ;
- un email déjà connu, quelle que soit la casse — message : « Un client avec cette adresse existe déjà. », avec proposition d'ouvrir la fiche existante.

## Règle d'unicité

L'email est l'identifiant naturel d'un client : deux fiches ne peuvent pas partager la même adresse (comparaison insensible à la casse). C'est la protection principale contre les doublons.
