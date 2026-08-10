# Référence du modèle PEF 0.1

Source de vérité : `template/schemas/0.1/asset.schema.json`.

## Front matter obligatoire

```yaml
---
pefVersion: "0.1"
assetType: Specification
id: SPEC-042
title: Gestion d'un client
status: Draft
version: 1.0.0
---
```

## AssetTypes, préfixes et suffixes de fichiers

| assetType | Préfixe ID | Suffixe fichier | Répertoire indicatif |
|---|---|---|---|
| Vision | `VIS-` | `.vis.md` | `product/vision/` |
| Goal | `GOAL-` | `.goal.md` | `product/goals/` |
| Roadmap | `RM-` | `.rm.md` | `product/roadmap/` |
| Persona | `PER-` | `.per.md` | `product/personas/` |
| WorkItem (Epic) | `EPIC-` | `.epic.md` | `product/backlog/` |
| WorkItem (UserStory) | `US-` | `.us.md` | `product/backlog/` |
| WorkItem (Bug) | `BUG-` | `.bug.md` | `product/backlog/` |
| Requirement | `REQ-` | `.req.md` | `product/requirements/` |
| BusinessRule | `BR-` | `.br.md` | `product/requirements/` |
| NonFunctionalRequirement | `NFR-` | `.nfr.md` | `product/requirements/` |
| Specification | `SPEC-` | `.spec.md` | `product/specifications/<SPEC>/` |
| AcceptanceCriteria | `AC-` | `.ac.md` | répertoire de la Specification parente |
| TestPlan | `TP-` | `.tp.md` | `product/quality/<TP>/` |
| TestCase | `TC-` | `.tc.md` | répertoire du TestPlan parent |
| Decision | `DEC-` | `.dec.md` | `product/decisions/` |
| Release | `REL-` | `.rel.md` | `product/releases/` |
| Documentation | `DOC-` | `.doc.md` | `product/documentation/` |

Nom de fichier : `<ID>-<slug>.<suffixe>.md` (slug en minuscules `a-z0-9-`). IDs uniques, jamais renumérotés (DEC-001).

## Relations (vocabulaire fermé)

| Relation | Sens | Exemple |
|---|---|---|
| `refines` | précise un Asset plus général | `Goal refines Vision`, `AC refines Specification` |
| `satisfies` | répond à une exigence ou un objectif | `Specification satisfies Requirement` |
| `verifies` | vérifie un Asset | `TestCase verifies AC`, `TestPlan verifies Specification` |
| `dependsOn` | dépend de | `Specification dependsOn BusinessRule` |
| `supersedes` | remplace | `DEC-005 supersedes DEC-002` |
| `impacts` | affecte | `Bug impacts Specification` |
| `documents` | documente | `Documentation documents Specification` |

## Statuts et transitions

`Draft → Review → Approved → Deprecated`, plus `Generated` pour une production IA non revue.

- Un retour en `Draft`/`Review` est toujours possible (le contenu repart en revue).
- Interdits : `Draft → Approved` (revue sautée), `Generated → Approved` (revue humaine obligatoire, EF-18), toute sortie de `Deprecated`.
- Contrôle en CI ou local : `npm run pef -- validate --since <ref-git>`.

## Provenance IA

Obligatoire dès qu'un Processor non humain produit ou modifie l'Asset (statut `Generated` exigé à la création) :

```yaml
ai:
  generated: true
  processor: GenerateTestPlan
  processorVersion: "1.0"
  reviewed: false        # puis true + reviewedBy/reviewedAt après revue
```

## Règles de validation

| Règle | Contrôle |
|---|---|
| PEF001 | Front matter YAML présent et lisible |
| PEF002 | Conformité au JSON Schema (types, statuts, semver, clés autorisées) |
| PEF003 | Préfixe de l'ID cohérent avec l'assetType / workItemType |
| PEF004 | Nom de fichier conforme à `<ID>-<slug>.<suffixe>.md` (EF-35) |
| PEF005 | Unicité des IDs dans le repo |
| PEF006 | Toute référence résout vers un Asset existant |
| PEF007 | Pas d'auto-référence |
| PEF008 | Transitions de statut autorisées (avec `--since <ref>`) |

## Couverture (lot 1)

`requirement-without-spec`, `requirement-without-ac`, `spec-without-ac`, `ac-without-testcase`, `orphan-asset` (hors Decisions), `broken-ref`.
