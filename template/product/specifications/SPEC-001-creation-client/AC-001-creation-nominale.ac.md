---
pefVersion: "0.1"
assetType: AcceptanceCriteria
id: AC-001
title: Création nominale d'une fiche client
status: Approved
version: 1.0.0
refines: [SPEC-001]
---

# Création nominale d'une fiche client

```gherkin
Scénario : création d'un client avec des données valides
  Étant donné qu'aucun client n'existe avec l'email "marie@exemple.fr"
  Quand je crée un client "Marie Durand" avec l'email "marie@exemple.fr"
  Alors la fiche client est créée
  Et la fiche affichée porte le nom "Marie Durand" et l'email "marie@exemple.fr"
```
