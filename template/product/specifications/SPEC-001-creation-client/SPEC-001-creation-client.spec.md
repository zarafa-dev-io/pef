---
pefVersion: "0.1"
assetType: Specification
id: SPEC-001
title: Spécification — création d'une fiche client
status: Approved
version: 1.0.0
satisfies: [REQ-001, NFR-001]
dependsOn: [BR-001]
---

# Spécification — création d'une fiche client

## Champs

| Champ | Obligatoire | Contrôle |
|---|---|---|
| Nom | Oui | Non vide, 100 caractères max |
| Email | Oui | Format RFC 5322 simplifié ; unicité (BR-001, insensible à la casse) |
| Téléphone | Non | Chiffres, espaces, `+` uniquement |

## Comportement

1. L'utilisateur saisit les champs et valide.
2. Si un contrôle échoue, la fiche n'est pas créée et le champ en erreur est signalé avec un message explicite.
3. Si l'email existe déjà, le message propose d'ouvrir la fiche existante (aucun doublon créé).
4. En cas de succès, la fiche est créée et affichée ; la réponse respecte NFR-001 (< 500 ms au p95).

## Messages d'erreur

- Email invalide : « L'adresse email n'est pas valide. »
- Email déjà connu : « Un client avec cette adresse existe déjà. »
