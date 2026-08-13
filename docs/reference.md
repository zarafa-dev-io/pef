# Référence du modèle PEF 0.1

La description complète du contrat des Assets. La source de vérité formelle est le JSON Schema : `schemas/0.1/asset.schema.json` — cette page l'explique en français.

## Le front matter, champ par champ

Tout Asset commence par un bloc YAML entre deux lignes `---`. Six champs sont **obligatoires** :

| Champ | Rôle | Valeurs autorisées | Erreur si absent/faux |
|---|---|---|---|
| `pefVersion` | Version du modèle PEF | `"0.1"` (avec les guillemets) | PEF002 |
| `assetType` | Nature de l'Asset | un des 15 types (voir tableau suivant) | PEF002 |
| `id` | Identifiant unique et définitif | `<PREFIXE>-<nnn>`, ex. `SPEC-042` | PEF002/003/005 |
| `title` | Titre lisible | texte libre non vide | PEF002 |
| `status` | Validité du contenu | `Draft`, `Review`, `Approved`, `Deprecated`, `Generated` | PEF002 |
| `version` | Version sémantique du contenu | `X.Y.Z`, ex. `1.0.0` | PEF002 |

Champs **optionnels** (selon le type) :

| Champ | Pour qui | Rôle |
|---|---|---|
| `workItemType` | WorkItem (obligatoire) | `Epic`, `UserStory` ou `Bug` |
| `workflowState` | WorkItem (obligatoire) | avancement du travail : `Drafting`, `Todo`, `InProgress`, `Validated` |
| `priority` | WorkItem | `Must`, `Should`, `Could`, `Wont` (MoSCoW, DEC-004) |
| `docType` | Documentation (obligatoire) | `Functional`, `Technical`, `Onboarding` |
| `coveredVersions` | Documentation | la version de chaque Asset documenté au moment de l'approbation — **obligatoire en `Approved`** (PEF012), base de la détection de péremption `stale-doc` |
| `certainty` | BusinessRule | pour une règle extraite du code : `observed` (lue telle quelle) ou `inferred` (déduite — validation métier requise avant `Approved`) |
| `externalRef` | tous | référence(s) externe(s) : clé Jira ou URL, une ou plusieurs (`"PROJ-123"` ou `["PROJ-123", "https://…"]`) — non contrôlées, restituées dans le sommaire (Backlog) et le viewer |
| `codeRefs` | Documentation, BusinessRule | chemins de code au format `<repo>/<chemin>[:<lignes>]` (DEC-006) — non contrôlés |
| `ai` | tous | bloc de provenance IA (voir plus bas) |

Toute clé inconnue est **rejetée** (PEF002) : c'est ce qui attrape les fautes de frappe (`statut:`, `prioritie:`…).

## AssetTypes, préfixes et suffixes

| assetType | Préfixe ID | Suffixe fichier | Répertoire indicatif | En un mot |
|---|---|---|---|---|
| Vision | `VIS-` | `.vis.md` | `product/vision/` | Le pourquoi du produit |
| Goal | `GOAL-` | `.goal.md` | `product/goals/` | Un objectif **mesurable** |
| Roadmap | `RM-` | `.rm.md` | `product/roadmap/` | **Un Asset par élément** (thème × horizon, DEC-005) |
| Persona | `PER-` | `.per.md` | `product/personas/` | Un profil d'utilisateur réel |
| WorkItem (Epic) | `EPIC-` | `.epic.md` | `product/backlog/` | Un grand thème livrable |
| WorkItem (UserStory) | `US-` | `.us.md` | `product/backlog/` | Un besoin, une itération |
| WorkItem (Bug) | `BUG-` | `.bug.md` | `product/backlog/` | Un défaut **qualifié** |
| Requirement | `REQ-` | `.req.md` | `product/requirements/` | Ce que le système doit faire |
| BusinessRule | `BR-` | `.br.md` | `product/requirements/` | Une règle métier invariante |
| NonFunctionalRequirement | `NFR-` | `.nfr.md` | `product/requirements/` | Performance, sécurité… |
| Specification | `SPEC-` | `.spec.md` | `product/specifications/<SPEC>/` | Le comportement détaillé |
| AcceptanceCriteria | `AC-` | `.ac.md` | répertoire de sa Specification | Un critère vérifiable |
| TestPlan | `TP-` | `.tp.md` | `product/quality/<TP>/` | Périmètre + stratégie de recette |
| TestCase | `TC-` | `.tc.md` | répertoire de son TestPlan | Un cas exécutable |
| Decision | `DEC-` | `.dec.md` | `product/decisions/` | Un choix structurant, tracé |
| Release | `REL-` | `.rel.md` | `product/releases/` | Une livraison, en langage métier |
| Documentation | `DOC-` | `.doc.md` | `product/documentation/<type>/` (`fonctionnelle` \| `technique` \| `onboarding`) | Le `docType` du front matter fait foi ; le sous-répertoire le rend visible d'un coup d'œil |

**Nom de fichier** : `<ID>-<slug>.<suffixe>.md` — le slug en minuscules `a-z0-9-`.

- ✅ `SPEC-042-gestion-client.spec.md`
- ❌ `spec42.md` (pas d'ID, pas de suffixe), `SPEC-042-Gestion_Client.spec.md` (majuscules, underscore), `SPEC-042-gestion-client.md` (suffixe manquant)

Le suffixe permet aux instructions IA de cibler un type où qu'il soit rangé (`applyTo: "**/*.spec.md"`) — l'arborescence, elle, n'est qu'indicative. Les IDs ne sont **jamais** renumérotés ni réutilisés, même après dépréciation (DEC-001) : on déprécie un Asset, on ne le supprime pas (le supprimer casserait les références entrantes).

## Les relations : quand utiliser laquelle ?

Vocabulaire **fermé** (toute autre clé est rejetée) ; chaque relation est une liste d'IDs.

| Relation | Se lit « … » | Quand l'utiliser | Exemples types |
|---|---|---|---|
| `refines` | précise, détaille | l'Asset détaille un Asset plus général | `Goal refines Vision` · `US refines Epic` · `AC refines Specification` |
| `satisfies` | répond à | l'Asset répond à une exigence ou un objectif | `Specification satisfies Requirement` · `RM satisfies Goal` · `Epic satisfies RM` |
| `verifies` | vérifie | l'Asset apporte la preuve | `TestCase verifies AC` · `TestPlan verifies Specification` |
| `dependsOn` | a besoin de | dépendance nécessaire | `Specification dependsOn BusinessRule` · `Bug dependsOn TestCase` (non-régression) · `Release dependsOn WorkItem` (contenu livré) |
| `supersedes` | remplace | nouvelle version d'une Decision | `DEC-007 supersedes DEC-002` |
| `impacts` | affecte | l'Asset met en cause d'autres Assets | `Bug impacts Specification` |
| `documents` | documente | une Documentation déclare les Assets qu'elle couvre | `Documentation documents Specification` · `Documentation documents BusinessRule` |

Règles générales : on déclare la relation **sur l'Asset aval** (l'AC pointe vers sa Spec, pas l'inverse) ; toute cible doit exister (PEF006) ; pas d'auto-référence (PEF007).

## Les statuts : le cycle de vie du contenu

```
            ┌────────────┐
            ▼            │
Draft ──► Review ──► Approved ──► Deprecated
  ▲          │            │
  └──────────┘            ▼
                     (retour possible en Draft/Review :
Generated ──► Review      le contenu repart en relecture)
    │
    └──► Draft
```

- `Draft` — en cours d'écriture, tout est permis.
- `Review` — soumis à relecture (c'est l'étape que PEF008 rend obligatoire).
- `Approved` — validé : les autres Assets et l'équipe peuvent s'appuyer dessus.
- `Deprecated` — retiré du jeu, conservé pour l'historique. **État terminal.**
- `Generated` — produit par une IA, pas encore relu. Ne peut aller qu'en `Review`, `Draft` ou `Deprecated`.

Transitions **interdites** (contrôlées par `pef validate --since <ref>`) : `Draft → Approved` (relecture sautée) et `Generated → Approved` (production IA approuvée sans revue) — les deux garanties Human in the Loop.

## Le versioning sémantique (DEC-003)

| Niveau | Quand | Effet sur l'aval |
|---|---|---|
| **PATCH** `x.y.Z` | typo, reformulation, mise en page — le sens ne change pas | aucun |
| **MINEUR** `x.Y.0` | ajout ou précision **compatible** (nouveau cas, détail) | revue facultative |
| **MAJEUR** `X.0.0` | **le sens change** : comportement, règle, périmètre | les Assets aval doivent être revus |

Un bump majeur amont n'invalide **jamais** automatiquement l'aval : l'outillage détecte et signale, l'humain décide (`pef impact <ID>` liste ce qui est à examiner). En cas de doute entre mineur et majeur : choisissez majeur.

## Cycle de vie des WorkItems : deux axes indépendants

| Axe | Champ | Valeurs | Question |
|---|---|---|---|
| Contenu | `status` | Draft → Review → Approved | « Ce qui est écrit est-il juste ? » |
| Réalisation | `workflowState` | Drafting → Todo → InProgress → Validated | « Où en est le travail ? » |

Gardes (contrôlées avec `--since`) :

- **→ `Todo`** : le contenu doit être `Approved` — on n'exécute pas un contenu non validé (PEF010) ;
- **→ `Validated`** : les AcceptanceCriteria de la chaîne aval doivent être `Approved` (PEF011) ;
- transitions **adjacentes uniquement**, dans les deux sens (PEF009) : pas de saut `Drafting → Validated`.

Exemple d'indépendance : une US `Validated` dont la Spec évolue (bump majeur) repasse en revue de **contenu** (`status`) — son `workflowState` ne bouge pas, le travail a bien été fait.

## La provenance IA (bloc `ai:`)

Obligatoire dès qu'un Processor non humain produit ou modifie l'Asset (le statut `Generated` l'exige à la création) :

```yaml
ai:
  generated: true
  processor: GenerateTestPlan     # quel Processor
  processorVersion: "1.0"         # dans quelle version
  reviewed: false                 # relu par un humain ?
```

Après revue et approbation :

```yaml
ai:
  generated: true
  processor: GenerateTestPlan
  processorVersion: "1.0"
  reviewed: true
  reviewedBy: ROLE-PO             # qui a validé
  reviewedAt: "2026-08-10"        # quand
```

C'est la réponse outillée à la question de gouvernance : *qui a généré quoi, qui a validé quoi ?*

## La péremption documentaire (lot 4)

Le mécanisme tient en trois pièces :

1. **`coveredVersions`** — à l'approbation d'une Documentation, on fige la version de chaque Asset couvert (PEF012 l'exige) ;
2. **`stale-doc`** — dès qu'un Asset couvert change de version, la couverture signale l'écart : `approved against SPEC-001 v1.0.0, now v2.0.0` ;
3. **`doc-enrichment`** — quand un WorkItem passe `Validated` et que sa chaîne est couverte par une Documentation périmée, `pef signal` ouvre une issue : l'humain déroule alors `/enrich-documentation` sur son poste (jamais la CI — elle détecte, elle n'exécute pas d'IA).

## Contrôles : où chercher le détail

- Les **11 règles bloquantes** (PEF001 → PEF011) et les **13 catégories de couverture** sont expliquées une à une, avec exemples d'erreurs et corrections, dans [le moteur de validation](validation.md).
- Les contrats et le circuit des Processors sont dans [les Processors](processors.md).
