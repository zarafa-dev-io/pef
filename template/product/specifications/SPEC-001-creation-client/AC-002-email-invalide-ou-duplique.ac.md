---
pefVersion: "0.1"
assetType: AcceptanceCriteria
id: AC-002
title: Rejet d'un email invalide ou déjà connu
status: Approved
version: 1.0.0
refines: [SPEC-001]
---

# Rejet d'un email invalide ou déjà connu

```gherkin
Scénario : email au format invalide
  Quand je crée un client "Paul Martin" avec l'email "paul[at]exemple"
  Alors la fiche n'est pas créée
  Et le message "L'adresse email n'est pas valide." est affiché

Scénario : email déjà connu (insensible à la casse)
  Étant donné un client existant avec l'email "marie@exemple.fr"
  Quand je crée un client "M. Durand" avec l'email "MARIE@exemple.fr"
  Alors la fiche n'est pas créée
  Et le message "Un client avec cette adresse existe déjà." est affiché
```
