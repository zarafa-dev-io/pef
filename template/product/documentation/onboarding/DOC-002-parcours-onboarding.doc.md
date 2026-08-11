---
pefVersion: "0.1"
assetType: Documentation
docType: Onboarding
id: DOC-002
title: Parcours d'onboarding — découvrir Clientis par les Assets
status: Approved
version: 1.0.0
documents: [VIS-001, PER-001, DOC-001]
coveredVersions:
  VIS-001: "1.0.0"
  PER-001: "1.0.0"
  DOC-001: "1.0.0"
---

# Parcours d'onboarding — découvrir Clientis par les Assets

Parcours de lecture ordonné pour un nouvel arrivant. Chaque étape indique l'Asset à lire et ce qu'il faut en retenir.

## Profil métier (PO, BA, sponsor)

1. **VIS-001** — la vision : le problème (clients dans des tableurs), la cible (TPE), les non-objectifs (pas un CRM complet) ;
2. **PER-001** — Camille, l'utilisateur type : ses objectifs et son critère d'adoption ;
3. **DOC-001** — la documentation fonctionnelle : ce que fait le produit aujourd'hui ;
4. `product/decisions/` — les cinq décisions structurantes, du nommage au versioning.

## Profil technique (dev, QA)

1. **VIS-001** puis **DOC-001** — comprendre le produit avant le code ;
2. **SPEC-001** et ses AC — le niveau de détail attendu d'une spécification ;
3. **TP-001** et ses TC — comment la recette est structurée ;
4. `tools/validate/` — lancer `npm run pef -- validate` et `trace SPEC-001` pour voir le graphe.
