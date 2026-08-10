---
pefVersion: "0.1"
assetType: Decision
id: DEC-006
title: Accès au code par workspace multi-root et format des codeRefs
status: Approved
version: 1.0.0
ai:
  generated: true
  processor: Claude
  reviewed: true
  reviewedBy: ROLE-PO
  reviewedAt: "2026-08-10"
---

# Accès au code par workspace multi-root et format des codeRefs

## Contexte

Tranche QO-8 du PRD. Le code source vit hors du repo PEF ; les Processors de rétro-documentation (EF-27) et de rafraîchissement (EF-28) doivent pouvoir le lire, et les `codeRefs` doivent rester interprétables.

## Décision

1. **Accès au code** : le PO ouvre un **workspace VS Code multi-root** contenant le repo PEF et le(s) repo(s) de code. Les Processors (Copilot) lisent le code directement dans le workspace — aucune configuration, aucun chemin absolu, valable pour les stacks modernes comme pour le legacy cloné localement.
2. **Format des `codeRefs`** : `<repo>/<chemin>[:<lignes>]`, relatif à la racine du repo de code, préfixé de son nom de dossier — ex. `clientis-app/src/clients/rules.ts:18-42`.
3. Les `codeRefs` **ne sont pas validés par le CLI** (le code est hors du repo PEF) : ils survivent mal aux refactorings, c'est accepté — leur péremption est détectée par `/refresh-documentation` (rapport « règles disparues du code »).

## Conséquences

- Aucun fichier de configuration de chemins à maintenir (l'option « chemin configuré » est écartée : fragile, différente par poste) ;
- prérequis d'usage : cloner le code avant une session de rétro-doc ; les prompts le rappellent ;
- réversible : si un scénario sans clone local apparaît (code inaccessible), l'option « extraits fournis » reste utilisable ponctuellement sans changer le modèle.
