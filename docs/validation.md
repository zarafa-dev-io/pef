# Le moteur de validation `pef`

Le moteur est un petit outil en ligne de commande, embarqué dans chaque repo PEF (`tools/validate/`). Il est **100 % local et déterministe** : aucun appel IA, aucun réseau — les mêmes fichiers en entrée donnent toujours le même rapport. La CI ne fait que le rejouer ; votre poste est le mode de référence.

## Préparer et lancer

```bash
cd tools/validate
npm install                      # une seule fois
npm run pef -- <commande>        # le -- est OBLIGATOIRE
```

Sans argument, `npm run pef --` affiche l'aide. Les commandes : `validate`, `coverage`, `trace`, `impact`, `signal`.

| Option | Commandes | Effet |
|---|---|---|
| `--since <ref-git>` | validate | active les contrôles de **transitions** en comparant à un état git antérieur |
| `--strict` | coverage | code de sortie 1 si au moins un trou (pour bloquer une CI) |
| `--root <dir>` | toutes | analyser un autre répertoire que `product/` |
| `--apply` | signal | exécuter réellement (par défaut : simulation) |

## Lire un rapport

```
backlog/US-002-recherche.us.md:10  PEF010  entering workflowState "Todo" requires asset status "Approved" (current: "Draft") — content must be validated before execution

26 asset(s) checked, 1 error(s).
```

Se lit : *fichier* `:` *ligne* — *règle* — *explication*. Code de sortie : `0` si tout est bon, `1` sinon (c'est ce que la CI regarde). La ligne indiquée est celle du champ en cause dans le fichier.

## `validate` — les 11 règles bloquantes

### Structure et identité

| Règle | Contrôle | Exemple d'erreur | Correction |
|---|---|---|---|
| PEF001 | Le front matter existe et se lit | `missing YAML front matter block (---)` | encadrez l'en-tête de deux lignes `---` ; vérifiez l'indentation YAML |
| PEF002 | Conformité au JSON Schema | `/status must be equal to one of the allowed values` | valeur hors liste ou clé inconnue (faute de frappe) — comparez au [modèle](reference.md) |
| PEF003 | Préfixe d'ID ↔ type | `id "REQ-042" does not match expected prefix "SPEC-"` | l'ID ne correspond pas à l'`assetType` : corrigez l'un ou l'autre |
| PEF004 | Nom de fichier (EF-35) | `file name "spec42.md" does not follow "<ID>-<slug>.spec.md"` | renommez : `SPEC-042-mon-slug.spec.md` |
| PEF005 | Unicité des IDs | `duplicate id "AC-003" (also used by …)` | copie de fichier sans changer l'`id` : prenez le premier numéro libre |

### Relations

| Règle | Contrôle | Exemple d'erreur | Correction |
|---|---|---|---|
| PEF006 | Toute référence résout | `unresolved reference "refines: SPEC-999"` | faute de frappe dans l'ID, ou la cible n'existe pas encore |
| PEF007 | Pas d'auto-référence | `asset references itself via "refines"` | retirez l'ID de sa propre liste |

### Documentation

| Règle | Contrôle | Exemple d'erreur | Correction |
|---|---|---|---|
| PEF012 | Documentation `Approved` ⇒ `coveredVersions` complet | `coveredVersions is missing an entry for documented asset "SPEC-001"` | à l'approbation, enregistrez la version courante de chaque Asset listé dans `documents` |

### Transitions (nécessitent `--since <ref-git>`)

Ces règles comparent le front matter actuel à celui d'un état git antérieur — typiquement `--since origin/main` dans une PR, ou `--since HEAD` avant de committer.

| Règle | Contrôle | Exemple d'erreur | Correction |
|---|---|---|---|
| PEF008 | Transitions de `status` | `status transition "Generated" -> "Approved" is not allowed` | passez par `Review` : la relecture humaine n'est pas optionnelle |
| PEF009 | Transitions de `workflowState` adjacentes | `workflowState transition "Drafting" -> "Validated" is not allowed` | avancez étape par étape : Todo, InProgress, puis Validated |
| PEF010 | → `Todo` exige contenu `Approved` | `entering "Todo" requires asset status "Approved"` | faites d'abord approuver le contenu du WorkItem |
| PEF011 | → `Validated` exige AC `Approved` | `…requires linked AcceptanceCriteria to be "Approved" (not approved: AC-007)` | faites relire et approuver les AC citées |

> Pourquoi `--since` ? Une transition est un **changement** : il faut un point de comparaison. Sans `--since`, ces règles sont simplement inactives — le reste est toujours contrôlé.

## `coverage` — les 13 trous de traçabilité

La couverture ne bloque pas (sauf `--strict`) : elle rend visibles les **dettes**. Chaque catégorie, pourquoi c'est un problème, et le geste qui corrige :

| Catégorie | Le problème | Le geste |
|---|---|---|
| `requirement-without-spec` | Une exigence que rien ne décrit : invérifiable | écrire la Specification (`satisfies`) |
| `requirement-without-ac` | Exigence jamais reliée à un critère vérifiable | dérouler Spec → AC (`/generate-acceptance-criteria`) |
| `spec-without-ac` | Une spec sans critères : « fini » ne veut rien dire | `/generate-acceptance-criteria` |
| `ac-without-testcase` | Un critère sans preuve | `/generate-test-cases` |
| `epic-without-userstory` | Un thème jamais découpé : rien n'avancera | `/draft-user-stories` |
| `userstory-without-ac` | Une US sans définition de « fait » | rattacher/écrire les AC |
| `bug-without-regression-test` | Un bug sans filet : il reviendra | créer le TC et le lier en `dependsOn` |
| `workitem-validated-without-testcase` | « Validé » sans preuve | rattacher les tests qui l'attestent |
| `workitem-inprogress-upstream-draft` | Le sol bouge sous un travail en cours | statuer sur l'amont repassé en Draft avant de continuer |
| `goal-without-workitem` | Un objectif que personne ne sert : vœu pieux | `/draft-roadmap` puis `/draft-epics` |
| `roadmap-without-goal` | Un élément de roadmap sans objectif : pourquoi le faire ? | relier au Goal, ou questionner l'élément |
| `spec-approved-without-doc` | Une spec approuvée que la documentation ignore | la couvrir par une Documentation (`documents`) |
| `doc-without-documents` | Une Documentation qui ne couvre rien : invérifiable | déclarer les Assets couverts dans `documents` |
| `stale-doc` | Un Asset couvert a changé depuis l'approbation de la doc | `/refresh-documentation` (rapport) puis `/enrich-documentation` |
| `orphan-asset` | Un Asset relié à rien : personne ne le trouvera | ajouter la relation qui le situe (les Decisions sont exemptées) |
| `broken-ref` | Référence cassée (vue couverture de PEF006) | corriger l'ID cible |

Les Assets `Deprecated` sont exclus de l'analyse.

## `trace` — d'où ça vient, où ça va

```bash
npm run pef -- trace SPEC-001
```

Affiche l'arborescence **amont** (ce que l'Asset référence, de proche en proche : exigence, user story, epic, roadmap, goal, vision) puis **aval** (tout ce qui s'appuie sur lui : AC, plans, cas de test). Utile avant une réunion (« d'où sort cette exigence ? ») comme en audit (« quels tests couvrent cette feature ? »).

## `impact` — qu'est-ce que je casse si je change ceci ?

```bash
npm run pef -- impact SPEC-001
```

Liste la fermeture aval complète — tout ce qui, directement ou indirectement, s'appuie sur l'Asset — avec les tests marqués `⚠`. **Réflexe à prendre avant toute modification de Specification**, et à coller dans la description de la PR.

## `summary` — le sommaire vivant du produit

```bash
npm run pef -- summary
```

Génère **`product/README.md`** en deux parties :

1. **La vue par domaine fonctionnel** (la restitution de référence, DEC-008) — ouverte par la **carte du produit** (diagramme Mermaid rendu nativement par GitHub : Vision → Objectifs → Roadmap → Domaines, chaque domaine coloré selon son état de réalisation avec son nombre d'Assets) — puis, pour chaque domaine : un domaine = un Epic, et sous lui tout ce que le graphe y rattache — US, bugs, exigences, règles, specs, critères, tests, documentation — avec la chaîne stratégique (« sert RM-001 → GOAL-001 ») et la **couverture propre au domaine** (`✔ complète` ou les trous). Les Assets métier sans Epic apparaissent en « Hors domaine ». C'est la vue qui raconte le produit ; elle est calculée depuis les relations, donc jamais désynchronisée.
2. **L'inventaire par type** : la vue exhaustive « modèle » (vision → … → documentation), avec les colonnes utiles par famille (priorité et réalisation des WorkItems, état à jour/périmée des Documentations).

GitHub l'affiche automatiquement en tête du répertoire `product/`.

La CI le **régénère à chaque push** (job `summary`) : le sommaire ne ment jamais, il n'est pas maintenu à la main. Sortie 100 % déterministe, aucune IA (NFR-1).

## `signal` — transformer les rapports en travail d'équipe

```bash
npm run pef -- signal            # simulation : liste ce qui serait fait
npm run pef -- signal --apply    # exécute via le CLI gh
```

Pour chaque action humaine requise, une **issue GitHub** est créée :

| Type d'issue | Déclencheur |
|---|---|
| `review-required` | un Asset en `Review` ou `Generated` attend une relecture |
| `coverage-gap` | un trou de couverture (exigence sans test, epic sans US…) |
| `broken-ref` | une référence cassée |
| `rules-to-validate` | une BusinessRule `inferred` (extraite du code) attend sa validation métier |
| `doc-enrichment` | un WorkItem `Validated` dont la chaîne est couverte par une Documentation périmée — à traiter localement avec `/enrich-documentation` |

Règles : une seule issue ouverte par (Asset, type d'action), jamais dupliquée ; **fermeture automatique** quand le contrôle constate que l'écart a disparu ; chaque issue cite la commande de vérification.

Prérequis en local : le CLI `gh` authentifié (`gh auth login`) et un remote GitHub. En CI, le job `signal` du workflow fait le même travail sur chaque push `main` (détection seulement — jamais d'exécution IA).

## La CI : un renfort, pas une dépendance

`.github/workflows/pef-validate.yml` rejoue `validate` + `coverage` sur chaque PR et push. C'est un filet : tout fonctionne **sans** (contexte d'entreprise où la CI est restreinte — contrainte assumée du PRD §7). La CI n'exécute jamais d'appel IA.

## Performances

Cible : `validate` < 2 s sur 1 000 Assets (NFR-4). Une passe unique sur les fichiers ; largement tenu sur l'exemple.
