# Le moteur de validation `pef`

Script Node/TypeScript embarqué dans `tools/validate/` de chaque repo PEF (portage Go à iso-contrat prévu au lot 5). **100 % local et déterministe** : aucun appel LLM, aucun réseau (NFR-1/2) — la CI n'est qu'un renfort, le poste de travail est le mode de référence.

```bash
cd tools/validate && npm install   # une fois
npm run pef -- <commande> [options]
```

## `validate` — les erreurs bloquantes

```bash
npm run pef -- validate [--since <ref-git>] [--root <dir>]
```

Rapport `fichier:ligne  règle  message`, code de sortie 1 en cas d'erreur (intégrable en CI).

| Règle | Contrôle |
|---|---|
| PEF001 | Front matter YAML présent et lisible (BOM/CRLF tolérés) |
| PEF002 | Conformité au JSON Schema (`schemas/0.1/asset.schema.json`) : clés obligatoires, enums, semver, clés inconnues rejetées |
| PEF003 | Préfixe de l'ID cohérent avec `assetType`/`workItemType` |
| PEF004 | Nom de fichier `<ID>-<slug>.<suffixe>.md` (EF-35) |
| PEF005 | Unicité des IDs dans tout le repo |
| PEF006 | Toute référence résout vers un Asset existant |
| PEF007 | Pas d'auto-référence |
| PEF008 | Transitions de `status` autorisées — nécessite `--since` |
| PEF009 | Transitions de `workflowState` adjacentes — nécessite `--since` |
| PEF010 | Passage à `Todo` : contenu `Approved` exigé |
| PEF011 | Passage à `Validated` : AC de la chaîne aval `Approved` exigées |

`--since <ref>` compare le front matter courant à celui de la référence git (ex. `--since origin/main` dans une PR, `--since HEAD` avant commit).

## `coverage` — les trous de traçabilité

```bash
npm run pef -- coverage [--strict]   # --strict : exit 1 si trous
```

| Catégorie | Signification |
|---|---|
| `requirement-without-spec` | Requirement sans Specification qui le `satisfies` |
| `requirement-without-ac` | Requirement non couvert par des AC (via ses Specifications) |
| `spec-without-ac` | Specification sans AC qui la `refines` |
| `ac-without-testcase` | AC vérifiée par aucun TestCase |
| `epic-without-userstory` | Epic sans UserStory qui le `refines` |
| `userstory-without-ac` | UserStory sans AC dans sa chaîne aval |
| `bug-without-regression-test` | Bug sans `dependsOn` vers un TestCase de non-régression |
| `workitem-validated-without-testcase` | WorkItem `Validated` sans TestCase dans sa chaîne |
| `workitem-inprogress-upstream-draft` | WorkItem `InProgress` dont un Asset amont est repassé en `Draft` |
| `orphan-asset` | Asset sans aucune relation (hors Decisions) |
| `broken-ref` | Référence cassée (doublonne PEF006, vue « couverture ») |

Les Assets `Deprecated` sont exclus de l'analyse.

## `trace` et `impact` — naviguer le graphe

```bash
npm run pef -- trace SPEC-001    # chaîne amont + aval, arborescente
npm run pef -- impact SPEC-001   # fermeture transitive aval ; tests signalés ⚠
```

`trace` répond à « d'où vient / où va cet Asset » ; `impact` répond à « qu'est-ce que je casse si je modifie ceci » (EF-24) — à exécuter avant toute modification de Specification et à citer dans la PR.

## `signal` — les issues d'équipe (EF-33)

```bash
npm run pef -- signal            # dry-run : liste ce qui serait créé/fermé
npm run pef -- signal --apply    # applique via le CLI gh
```

Transforme les rapports en **issues GitHub actionnables** : une issue par (Asset, type d'action), jamais dupliquée, **fermée automatiquement** quand le contrôle déterministe constate que l'écart a disparu. Types actuels : `review-required` (statut `Review`/`Generated`), `coverage-gap`, `broken-ref`. Fonctionne depuis le poste (`gh` authentifié) ; la CI peut le relayer si l'environnement l'autorise.

## Deux modes d'exécution (contrainte §7 du PRD)

| Mode | Quand | Quoi |
|---|---|---|
| **Local** (référence) | poste du PO, toujours disponible | toutes les commandes, y compris `signal --apply` |
| **CI** (renfort) | si l'environnement l'autorise | `validate` + `coverage` sur chaque PR (`.github/workflows/pef-validate.yml`) — jamais d'appel IA |

## Performances

Cible NFR-4 : `validate` < 2 s sur 1 000 Assets. L'implémentation actuelle parcourt le repo en une passe et tient largement la cible sur l'exemple.
