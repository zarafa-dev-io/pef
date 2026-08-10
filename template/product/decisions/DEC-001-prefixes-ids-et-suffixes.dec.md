---
pefVersion: "0.1"
assetType: Decision
id: DEC-001
title: Préfixes d'IDs, suffixes de fichiers et interdiction de renumérotation
status: Approved
version: 1.0.0
ai:
  generated: true
  processor: Claude
  reviewed: true
  reviewedBy: ROLE-PO
  reviewedAt: "2026-08-10"
---

# Préfixes d'IDs, suffixes de fichiers et interdiction de renumérotation

## Contexte

Tranche QO-5 du PRD. Les identifiants et les noms de fichiers sont le socle de la traçabilité et des ciblages IA (`applyTo`) ; ils doivent être figés avant le premier pilote (EF-2, EF-35).

## Décision

1. **Préfixes d'IDs** (un par assetType, format `<PREFIXE>-<nnn>`) : `VIS-`, `GOAL-`, `RM-`, `PER-`, `REQ-`, `BR-`, `NFR-`, `SPEC-`, `AC-`, `TP-`, `TC-`, `DEC-`, `REL-`, `DOC-` — et par sous-type de WorkItem : `EPIC-`, `US-`, `BUG-`.
2. **Suffixes de fichiers** : `<ID>-<slug>.<suffixe>.md`, le suffixe étant le préfixe en minuscules (ex. `SPEC-042-gestion-client.spec.md`). Le front matter reste la source de vérité ; la validation contrôle la cohérence suffixe ↔ assetType ↔ préfixe.
3. **Renumérotation interdite** : un ID attribué ne change jamais et n'est jamais réutilisé, même après dépréciation de l'Asset. La numérotation est croissante par préfixe, sans exigence de continuité.

## Conséquences

- Les globs Copilot `applyTo` ciblent un assetType indépendamment de l'arborescence.
- La suppression physique d'un fichier casse les références entrantes : on déprécie (`Deprecated`), on ne supprime pas.
