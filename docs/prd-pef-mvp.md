---
pefVersion: "0.1"
assetType: PRD
id: PRD-001
title: PEF MVP — PEF-PO complet, de la vision aux tests fonctionnels
status: Draft
version: 0.13.0
refines: [MANIFESTO-001]
ai:
  generated: true
  processor: Claude
  reviewed: false
---

# PRD — PEF MVP (PEF-PO)

> Dérivé du manifeste d'architecture PEF v0.3 (08/2026). Le manifeste porte la vision et les concepts ; ce PRD porte les exigences du MVP : le profil **PEF-PO complet**, couvrant l'ensemble des tâches d'un Product Owner, de la vision produit jusqu'aux tests fonctionnels.

## 1. Problème et opportunité

La connaissance produit est fragmentée entre outils, documents et personnes ; les assistants IA reconstruisent leur contexte à chaque usage via des prompts, instructions et workflows propriétaires. Il manque un langage commun, versionné et outillable, autour duquel humains et IA collaborent.

L'opportunité du MVP : démontrer sur **l'activité complète d'un Product Owner** — vision, roadmap, backlog (epics, user stories, bugs), spécifications, critères d'acceptation, tests fonctionnels et documentation d'onboarding — que des Product Assets markdown structurés, validés et tracés rendent cette collaboration effective, sans dépendre d'un fournisseur d'IA.

## 2. Objectifs et indicateurs de succès

| Objectif | Indicateur | Cible MVP |
|---|---|---|
| O1. Boucle complète démontrée | Les critères de succès (§10) passent sur un projet pilote réel | 100 % |
| O2. Couverture de l'activité PO | Tâches PO du §4 disposant d'un template + d'un Processor utilisés sur le pilote | 100 % |
| O3. Qualité de la génération | Taux d'acceptation des propositions IA (après modification humaine incluse) | ≥ 70 % *(à valider)* |
| O4. Traçabilité effective | WorkItems du pilote tracés de bout en bout (Goal ↔ TestCase) | 100 % |
| O5. Coût d'entrée faible | Temps pour créer et valider un premier Asset depuis un repo vierge | < 30 min *(à valider)* |
| O6. Indépendance IA | Nombre d'appels LLM dans le CLI de validation | 0 |

## 3. Personas d'adoption

- **PO pionnier** *(persona prioritaire)* : Product Owner techniquement outillé (VS Code, Git, Copilot), responsable de la vision, du backlog, des specs et de la recette, frustré par la fragmentation Jira/Confluence/Office. C'est lui qui installe PEF et l'utilise sur toute son activité.
- **QA partenaire** : conçoit et exécute la recette ; consomme les AcceptanceCriteria, coproduit TestPlan et TestCases.
- **Développeur consommateur** : lit les Assets depuis VS Code, les utilise comme contexte Copilot ; n'écrit pas d'Assets dans le MVP.
- **Sponsor / gouvernance** : veut l'auditabilité (qui a généré quoi, qui a validé quoi). Ne manipule pas l'outil.

## 4. Périmètre

### Inclus (MVP)

Le MVP couvre les tâches d'un PO, chacune outillée par des Assets, des templates et au moins un Processor :

| Activité PO | Assets produits |
|---|---|
| Formuler la vision et les objectifs | `Vision`, `Goal` |
| Construire et entretenir la roadmap | `Roadmap` |
| Décrire les utilisateurs | `Persona` |
| Constituer et raffiner le backlog | `WorkItem` (Epic, UserStory, Bug) |
| Spécifier | `Requirement`, `BusinessRule`, `NonFunctionalRequirement`, `Specification` |
| Définir l'acceptation | `AcceptanceCriteria` |
| Préparer la recette | `TestPlan`, `TestCase` |
| Décider et tracer | `Decision` |
| Préparer une livraison | `Release` |
| Documenter et embarquer les nouveaux arrivants | `Documentation` (fonctionnelle, technique, onboarding) |

Soit **16 assetTypes**, plus : le CLI `pef` (validation, couverture, traçabilité), les conventions de repository, et les Processors d'assistance aux cérémonies (refinement, sprint planning, sprint review) en tant que rapports préparatoires.

### Lotissement du MVP

Le périmètre est ambitieux pour une personne ; il est découpé en trois lots, chacun livrable et démontrable seul :

1. **Lot 1 — Socle** : PEF Core (schémas, IDs, relations, statuts, provenance), template de repo avec **validation embarquée** (script Node/TypeScript consommant les JSON Schemas), assets IA Copilot, GitHub Actions (validation + signalements), chaîne Specification → AC → TestPlan → TestCase.
2. **Lot 2 — Backlog** : WorkItems (Epic/UserStory/Bug), Processors de rédaction et de refinement, extension de la couverture (`Epic sans US`, `US sans AC`, `Bug sans test de non-régression`).
3. **Lot 3 — Amont et cérémonies** : Vision, Goal, Roadmap, Persona, Release ; Processors de préparation de sprint planning/review et de release notes.
4. **Lot 4 — Documentation et onboarding** : Asset `Documentation` (fonctionnelle, technique, onboarding), Processors de rétro-documentation depuis le code source existant, détection de documentation périmée.
5. **Lot 5 (différé, si besoin) — CLI `pef`** : portage Go du moteur de validation à iso-contrat (mêmes JSON Schemas, mêmes rapports), distribution en binaire unique, `pef new` et `pef init`. Conçu **local-first** : lancé manuellement par le PO, il agit sur GitHub via le CLI `gh` (`pef signal` : issues, fermetures, PR) sans dépendre d'une exécution en CI. Déclenché lorsque le modèle est stabilisé par l'usage et que la distribution au-delà du template le justifie.

### Projet pilote

PEF est agnostique au langage et au domaine — il ne doit pas être perçu comme un outillage mainframe.

- **Pilote principal (lots 1 à 4)** : le projet d'IDE sur base VS Code (TypeScript) du PO pionnier. Projet moderne, réel et accessible, à itérations rapides — et doublement rentable : PEF y est validé, et le projet y gagne sa documentation, son backlog structuré et son parcours d'onboarding.
- **Contre-pilote (lot 4)** : un périmètre mainframe COBOL délimité, pour prouver que la rétro-documentation (EF-27) et le modèle d'Assets fonctionnent à l'identique sur du legacy. C'est le contre-exemple qui démontre la généralité, pas le cas nominal.

### Exclus (non-objectifs du MVP)

- **Synchronisation Jira / outils de ticketing** — décision : PEF est la source de vérité de la *connaissance* (vision, exigences, règles, specs, tests) ; Jira reste l'outil d'*exécution* (tâches, sprints, suivi d'avancement). Aucune synchronisation automatique ; un lien manuel `externalRef` suffit (EF-6). En particulier, la mécanique de sprint (capacité, vélocité, burndown) reste hors de PEF. PEF porte en revanche l'état de réalisation minimal des WorkItems (`workflowState`, EF-30) : il est nécessaire à la traçabilité et au déclenchement documentaire (EF-31), et peut être reflété manuellement dans Jira via `externalRef`.
- Role Coverage et fonctions de gouvernance organisationnelle.
- Profiles méthodologiques formels (Scrum, SAFe…) — le MVP suppose implicitement un cadre itératif générique.
- Orchestrateur multi-agents, UI dédiée, visualisation graphique du graphe.
- PEF-QA au-delà des tests générés depuis les AC ; PEF-UX, Architecture, Development.
- Multi-repo et fédération d'Assets.

## 5. Exigences fonctionnelles

Priorisation MoSCoW. *(M = Must, S = Should, C = Could)* — le lot visé est indiqué entre crochets.

### Modèle d'Assets

- **EF-1 (M) [1]** — Tout Asset est un fichier markdown avec front matter YAML obligatoire : `pefVersion`, `assetType`, `id`, `title`, `status`, `version`.
- **EF-2 (M) [1]** — Les identifiants sont uniques dans le repo, au format `<PREFIXE>-<nnn>`, avec un préfixe par assetType : `VIS-`, `GOAL-`, `RM-`, `PER-`, `REQ-`, `BR-`, `NFR-`, `SPEC-`, `AC-`, `TP-`, `TC-`, `DEC-`, `REL-`, `DOC-` — et par sous-type de WorkItem : `EPIC-`, `US-`, `BUG-`.
- **EF-3 (M) [1]** — Les relations sont déclarées dans le front matter sous forme de listes d'IDs, avec un vocabulaire fermé : `refines`, `satisfies`, `verifies`, `dependsOn`, `supersedes`, `impacts`, `documents`. Toute autre clé de relation est rejetée par la validation.
- **EF-4 (M) [1]** — Les statuts autorisés et leurs transitions sont définis par le schéma : `Draft → Review → Approved → Deprecated` (+ `Generated` pour un Asset produit par un Processor et non revu).
- **EF-5 (M) [1]** — Granularité : un fichier par Asset, y compris `AcceptanceCriteria` et `TestCase` (adressables individuellement), regroupés par répertoire de leur parent.
- **EF-6 (S) [1]** — Un Asset peut porter une référence externe libre `externalRef` (URL ou clé Jira) non validée sémantiquement.
- **EF-7 (M) [1]** — Le bloc `ai:` de provenance (`generated`, `processor`, `processorVersion`, `reviewed`, `reviewedBy`, `reviewedAt`) est obligatoire dès qu'un Asset est produit ou modifié par un Processor non humain.
- **EF-8 (M) [2]** — `WorkItem` porte un champ `workItemType: Epic | UserStory | Bug`. Une UserStory `refines` un Epic ; un Bug `impacts` les Assets défaillants (Specification, BusinessRule…) et `dependsOn` son test de non-régression.
- **EF-9 (M) [3]** — La chaîne amont est modélisée par les relations : `Goal refines Vision`, `Roadmap satisfies Goal`, `Epic satisfies Roadmap|Goal`. Un élément de roadmap sans Goal est signalé par la couverture.
- **EF-35 (M) [1]** — Convention de nommage des fichiers : un Asset est nommé `<ID>-<slug>.<suffixe>.md`, où le suffixe (en minuscules, aligné sur les préfixes d'EF-2) identifie l'assetType : `.vis.md`, `.goal.md`, `.rm.md`, `.per.md`, `.req.md`, `.br.md`, `.nfr.md`, `.spec.md`, `.ac.md`, `.tp.md`, `.tc.md`, `.dec.md`, `.rel.md`, `.doc.md` — et par sous-type de WorkItem : `.epic.md`, `.us.md`, `.bug.md`. Exemple : `SPEC-042-gestion-client.spec.md`. Cette convention rend les Assets ciblables par globs de fichiers indépendamment de l'arborescence (qui reste indicative), notamment par les instructions Copilot `applyTo` (EF-34). Le front matter demeure la source de vérité : le suffixe n'est qu'une projection contrôlée, jamais interprétée seule — `pef validate` vérifie la triple cohérence suffixe ↔ `assetType`/`workItemType` ↔ préfixe de l'`id`.

### Validation (moteur `pef`)

> **Stratégie d'implémentation** : au MVP, les exigences EF-10 à EF-14 sont satisfaites par un **script de validation Node/TypeScript embarqué dans `template/`**, consommant les JSON Schemas (NFR-6). Le CLI Go (lot 5) les réimplémentera à iso-contrat. Dans ce document, `pef <commande>` désigne indifféremment l'une ou l'autre implémentation. Chaque commande s'exécute en deux modes : **local** (mode de référence, poste du PO) et **CI** (renfort optionnel, selon autorisation — §7) ; les rapports sont identiques dans les deux modes.

- **EF-10 (M) [1]** — `pef validate` contrôle : conformité au schéma JSON du front matter, unicité des IDs, résolution de toutes les références, vocabulaire des relations, statuts et transitions autorisés, conformité de la convention de nommage des fichiers (EF-35).
- **EF-11 (M) [1]** — `pef validate` retourne un code de sortie non nul en cas d'erreur, avec un rapport lisible (fichier, ligne, règle violée), pour intégration CI.
- **EF-12 (M) [1]** — `pef coverage` rapporte : Requirements sans AcceptanceCriteria, AcceptanceCriteria sans TestCase, Assets orphelins, références cassées. **[2]** : Epics sans UserStory, UserStories sans AC, Bugs sans TestCase de non-régression. **[3]** : Goals sans WorkItem, éléments de Roadmap sans Goal. **[4]** : Specifications approuvées sans Documentation, Documentation ne référençant aucun Asset (`documents` vide).
- **EF-13 (S) [1]** — `pef trace <ID>` affiche la chaîne de traçabilité montante et descendante d'un Asset.
- **EF-14 (S) [1]** — Une GitHub Action prête à l'emploi exécute `pef validate` + `pef coverage` sur chaque PR.
- **EF-15 (C) [5]** — `pef new <assetType>` scaffolde un Asset conforme (ID suivant disponible, template, front matter pré-rempli) ; `pef init` instancie le dépôt modèle (§8). Au MVP, l'instanciation se fait par copie du template.

### Génération et assistance (Processors)

- **EF-16 (M) [1]** — Chaque Processor est déclaré par un contrat YAML : `processor`, `version`, `inputs` (assetTypes), `outputs` (assetTypes ou `Report`).
- **EF-17 (M) [1]** — Chaîne de test livrée en prompt files Copilot : `GenerateAcceptanceCriteria` (Specification + BusinessRules + NFR → AC), `GenerateTestPlan` (Spec + AC → TP), `GenerateTestCases` (TP + AC → TC), couvrant cas nominaux, limites et erreurs.
- **EF-18 (M) [1]** — Tout Asset généré est créé en statut `Generated` avec le bloc `ai:` renseigné ; le passage à `Approved` exige une revue humaine (PR).
- **EF-19 (M) [2]** — Processors backlog : `DraftEpics` (Roadmap|Requirements → Epics), `DraftUserStories` (Epic + Specification → US + AC), `QualifyBug` (description brute → Bug qualifié, Assets impactés, test de non-régression proposé).
- **EF-20 (M) [2]** — Processor `RefineWorkItem` : analyse un WorkItem et produit un **rapport** (ambiguïtés, AC manquants, règles métier manquantes, dépendances, taille excessive, questions ouvertes) sans créer d'Asset — la décision reste au PO.
- **EF-21 (M) [3]** — Processors amont : `DraftVision` (notes libres → Vision + Goals), `DraftRoadmap` (Vision + Goals → Roadmap), `DraftPersona` (notes/entretiens → Persona).
- **EF-22 (S) [3]** — Processors de cérémonie (sorties = rapports) : `PrepareSprintPlanning` (backlog priorisé, dépendances, risques, agenda), `PrepareSprintReview` (livré vs prévu, scénarios de démo, impact roadmap).
- **EF-23 (S) [3]** — Processor `DraftReleaseNotes` : WorkItems terminés → Release (langage métier).
- **EF-24 (S) [1]** — Processor de maintenance : signaler les TestCases impactés par la modification d'une Specification (`pef impact <ID>` ou prompt dédié).
- **EF-25 (C) [2]** — Les contrats de Processors sont interrogeables : `pef processors` liste qui consomme/produit quoi, par activité.
- **EF-34 (M) [1]** — Orientation GitHub Copilot : les assets IA du template sont livrés aux formats natifs Copilot, à leurs emplacements standard (`.github/…`) — **fichiers d'instructions** (instructions globales du repo + instructions ciblées par assetType via `applyTo`, dont les globs s'appuient sur les suffixes de fichiers EF-35, ex. `applyTo: "**/*.spec.md"`), **agents spécialisés** (custom chat modes/agents par activité PO), **prompt files** (les workflows `/…` des Processors), **skills**, et **hooks** si besoin (contrôles pré-commit ou pré-génération). Le contrat des Processors (EF-16) reste agnostique : ces livrables Copilot sont l'implémentation de référence, substituable (NFR-1).

### Documentation et rétro-documentation

- **EF-26 (M) [4]** — AssetType `Documentation` avec un champ `docType: Functional | Technical | Onboarding` et préfixe `DOC-`. Une Documentation déclare les Assets qu'elle couvre via la relation `documents` (Specifications, BusinessRules, Decisions…) et peut référencer des chemins du code source (`codeRefs`, non validés par le CLI).
- **EF-27 (M) [4]** — Processors de rétro-documentation depuis un code source existant, agnostiques au langage — stacks modernes (TypeScript, Go, Python…) comme legacy (COBOL/JCL/CICS/DB2) : `ReconstructTechnicalDoc` (code → Documentation technique : composants, points d'entrée, flux de données, dépendances, références code), `ExtractBusinessRules` (code → BusinessRules en statut `Generated`, chacune avec sa référence de code et son niveau de certitude `observed | inferred`), `ReconstructFunctionalDoc` (Documentation technique + BusinessRules → Documentation fonctionnelle en langage métier). Toute production est en statut `Generated` et suit le circuit de revue (EF-18) — la validation métier des règles `inferred` est explicitement requise.
- **EF-28 (M) [4]** — Maintenance : un Processor `RefreshDocumentation` compare une Documentation aux Assets qu'elle `documents` (et aux `codeRefs` si le code est accessible) et produit un rapport d'écarts : sections périmées, Assets modifiés depuis la dernière revue, règles disparues du code. `pef coverage` signale les Documentations dont un Asset couvert a changé de version depuis leur dernière approbation.
- **EF-29 (S) [4]** — Processor `DraftOnboardingGuide` : à partir du graphe d'Assets (Vision, Personas, Documentation fonctionnelle et technique, principales BusinessRules et Decisions), produit une Documentation `Onboarding` : un parcours de lecture ordonné et commenté pour un nouvel arrivant, par profil (métier / technique).

### Cycle de vie des WorkItems et enrichissement documentaire

- **EF-30 (M) [2]** — En plus de son statut d'Asset (EF-4, qui porte la validité du *contenu*), un `WorkItem` porte un état de *réalisation* `workflowState : Drafting → Todo → InProgress → Validated`. Règles de transition contrôlées par `pef validate` : le passage à `Todo` exige un statut d'Asset `Approved` (on n'exécute pas un contenu non validé) ; le passage à `Validated` exige que les AcceptanceCriteria liées soient `Approved`. Les deux axes sont indépendants : un WorkItem `Validated` dont la Specification évolue repasse en revue de *contenu*, pas en `Todo`.
- **EF-31 (M) [4]** — Déclencheur documentaire en deux temps, la CI restant 100 % déterministe (aucun appel IA depuis la CI — contrainte §7) :
  1. **Détection (CI ou locale)** : au passage d'un WorkItem à `Validated`, un **signalement** est créé via le mécanisme générique d'issues (EF-33) — par le workflow GitHub (diff du front matter) si la CI est autorisée, sinon par `pef signal` exécuté sur le poste, qui compare l'état courant du repo aux issues ouvertes — issue étiquetée `doc-enrichment` listant le WorkItem et les `Documentation` concernées ; `pef coverage` rapporte les enrichissements en attente.
  2. **Exécution (locale)** : le PO déroule le Processor `EnrichDocumentation` depuis son poste (Copilot dans VS Code) : mise à jour des `Documentation` couvrant les Assets liés, PR en statut `Generated`. L'automatisation **signale et propose**, l'humain exécute et approuve (EF-18) — jamais de merge automatique.
  Le contrat du Processor est indépendant du déclencheur : si l'appel IA depuis la CI devient possible, seule l'étape 1 évolue.
- **EF-32 (S) [2]** — `pef coverage` signale : WorkItems `Validated` sans TestCase, WorkItems `InProgress` dont un Asset amont est repassé en `Draft`, et Documentation non rafraîchie après un lot de WorkItems `Validated`.

### Signalements d'équipe

- **EF-33 (S) [1, enrichi aux lots 2–4]** — Mécanisme générique de signalement : une GitHub Action transforme les rapports `pef validate` et `pef coverage` en **issues GitHub actionnables** dès qu'une action humaine est requise sur un document. Types d'actions étiquetés : `review-required` (Assets en `Review` ou `Generated` en attente), `coverage-gap` (Requirement sans AC, AC sans TestCase, Epic sans US…), `broken-ref` (référence cassée), `stale-doc` (Documentation périmée, EF-28), `doc-enrichment` (EF-31), `rules-to-validate` (BusinessRules `inferred` en attente de validation métier, EF-27). Règles : une seule issue ouverte par Asset et type d'action (mise à jour, jamais dupliquée) ; fermeture automatique lorsque le contrôle déterministe constate que l'écart a disparu ; chaque issue référence l'ID de l'Asset et la commande `pef` de vérification. Le mécanisme s'exécute dans les deux modes (§7) : par la GitHub Action quand l'environnement l'autorise, ou **manuellement depuis le poste** via `pef signal` (ou le script équivalent), qui s'appuie sur le CLI `gh` pour créer, mettre à jour et fermer les issues avec les mêmes règles de dédoublonnage.

## 6. Exigences non fonctionnelles

- **NFR-1 (M)** — AI-agnostic : le CLI n'effectue aucun appel LLM ; les Processors IA sont externes et substituables.
- **NFR-2 (M)** — Fonctionnement 100 % local et hors ligne pour la validation (contexte bancaire).
- **NFR-3 (M au lot 5)** — Le CLI sera distribué en binaire unique (Go), Windows/Linux/macOS, sans dépendance runtime. Au MVP, le script de validation embarqué ne requiert que Node.js (présent dans l'environnement VS Code cible).
- **NFR-4 (S)** — `pef validate` < 2 s sur un repo de 1 000 Assets.
- **NFR-5 (M)** — Schémas et clés de front matter en anglais ; contenu des Assets dans la langue de l'organisation.
- **NFR-6 (S)** — Schémas publiés en JSON Schema versionné (`pefVersion`) pour permettre des validateurs tiers.
- **NFR-7 (M)** — Agnostique au langage et au domaine : aucun assetType, relation, schéma ou Processor du socle ne présuppose une technologie, un secteur ou un type de projet.

## 7. Contraintes et dépendances

- Git/GitHub comme socle (historique, PR, revue). **GitHub Copilot est la cible IA du MVP** (EF-34) : instructions, agents, prompts, skills et hooks aux formats Copilot — sans exclusivité (NFR-1).
- Environnement SG : proxy, postes maîtrisés ; le binaire unique (NFR-3) en découle.
- **Exécution d'outillage en GitHub Actions incertaine côté SG** (autorisation d'exécuter un outil externe à une réalisation SG non confirmée) : le mode de référence de tout l'outillage PEF est l'**exécution locale sur le poste**, la CI n'étant qu'un renfort activé si l'environnement l'autorise. Toute action sur GitHub (issues, PR) doit être réalisable localement via le CLI `gh`.
- **Aucun appel IA possible depuis la CI à ce stade** : la CI n'exécute que du déterministe (validation, couverture, signalements) ; toute exécution de Processor IA se fait sur le poste de travail. Cohérent avec NFR-1 — et réversible sans refonte (EF-31).
- Une seule personne au démarrage : le lotissement (§4) est contractuel — le lot 2 ne démarre qu'après démonstration du lot 1 sur le pilote.

## 8. Organisation du projet

Le projet PEF démarre en **monorepo** composé de trois sous-répertoires autonomes, conçus dès l'origine pour être séparés en trois dépôts GitHub distincts (`pef-template`, `pef-cli`, `pef-docs`) lorsque QO-1 (licence et ouverture) sera tranchée.

```
pef/
├── template/    # dépôt projet cible modèle
├── cli/         # sources du CLI pef
└── docs/        # site de documentation (Docsify)
```

- **`template/` — dépôt projet cible modèle.** Contient l'organisation de référence d'un projet PEF, instanciable par copie (puis via `pef init`, EF-15) : arborescence des répertoires de documentation par assetType (§4), assets IA orientés GitHub Copilot à leurs emplacements natifs `.github/` (instructions globales et ciblées, agents spécialisés, prompt files, skills, hooks — EF-34) et contrats de Processors, conventions de nommage, GitHub Action de validation pré-câblée (EF-14) et un mini-exemple complet illustrant la chaîne Vision → Goal → Epic → UserStory → Specification → AC → TestPlan → TestCase.
- **`cli/` — sources du CLI `pef`** (Go, binaire unique — NFR-3), **créé au lot 5**. Au MVP, la source de vérité des schémas est `template/schemas/` (JSON Schemas, NFR-6), consommée par le script de validation embarqué (`template/tools/validate/`, Node/TypeScript) ; le CLI Go embarquera ces mêmes schémas lorsqu'il existera.
- **`docs/` — documentation utilisateur au format Docsify**, publiable sur GitHub Pages : le manifeste (vision et concepts), un guide de démarrage pas à pas, la référence des assetTypes, relations et statuts, le guide des Processors et un tutoriel par lot déroulant l'activité PO complète. Cible : les futurs utilisateurs, pas seulement les contributeurs.

Règles de cohabitation : chaque sous-répertoire a un versioning propre ; `template/` est épinglé sur un `pefVersion` donné ; `docs/` documente toujours la dernière release du moteur de validation (script au MVP, CLI au lot 5). Aucune dépendance de code entre les trois — seule la compatibilité de `pefVersion` les lie, ce qui garantit une séparation en trois dépôts sans refactoring.

## 9. Risques

| Risque | Impact | Mitigation |
|---|---|---|
| **Périmètre élargi à toute l'activité PO** : effet tunnel, MVP jamais « fini » | Élevé | Lotissement contractuel (§4) ; le lot 1 seul constitue déjà une démonstration complète |
| Adoption : PEF perçu comme « un standard de plus » | Élevé | Le CLI doit être utile seul, sans écosystème ; démonstration sur pilote réel |
| Double saisie ressentie avec Jira | Élevé | Non-objectif de synchro assumé + `externalRef` ; message clair connaissance vs exécution |
| Granularité des Assets inadaptée à l'usage réel (volumétrie backlog) | Moyen | Décision EF-5 réversible, testée sur le pilote, tranchée par une Decision versionnée |
| Qualité inégale des Processors amont (vision, roadmap : matière plus subjective) | Moyen | Sorties amont = propositions + rapports, jamais auto-approuvées ; itération sur les prompts |
| Rétro-doc trompeuse sur du legacy (règles inférées à tort, doc qui fige des bugs) | Élevé | Niveau `observed`/`inferred` obligatoire (EF-27), validation métier avant `Approved`, incohérences du code signalées et jamais lissées |
| Dépendance à une personne (bus factor 1) | Moyen | Tout est dans le repo : specs, schémas, décisions ; zéro connaissance implicite |

## 10. Critères de succès du MVP

Le MVP est réussi si un utilisateur (persona PO pionnier) peut, sur un projet pilote réel :

1. créer un Asset markdown conforme et le valider automatiquement ;
2. dérouler la chaîne amont : Vision → Goals → Roadmap avec assistance IA, revue et approbation par PR ;
3. constituer le backlog : Epics → UserStories (avec AC) → qualifier un Bug, chaque génération en statut `Generated` puis revue ;
4. obtenir un rapport de refinement sur un WorkItem et décider en connaissance de cause ;
5. dérouler la chaîne aval : Specification → AC → TestPlan → TestCases ;
6. retrouver la traçabilité bidirectionnelle complète Goal ↔ TestCase (`pef trace`) ;
7. détecter les trous de couverture à chaque niveau (`pef coverage`) et voir chaque action requise sur un document notifiée à l'équipe par une issue, fermée automatiquement une fois l'action réalisée ;
8. préparer un sprint planning et une sprint review à partir des Assets ;
9. substituer un Processor par un autre sans modifier les Assets ;
10. travailler intégralement dans Git, validation en CI comprise ;
11. reconstituer depuis un code existant une documentation technique et fonctionnelle en `Generated`, la faire valider, puis générer le parcours d'onboarding — et détecter sa péremption après modification d'un Asset couvert ;
12. faire passer un WorkItem par son cycle `Drafting → Todo → InProgress → Validated`, constater le signalement automatique en CI au passage à `Validated`, puis dérouler localement l'enrichissement de la documentation jusqu'à la PR approuvée.

## 11. Questions ouvertes

- **QO-1** — ~~Licence et ouverture~~ **Tranchée (v0.11.0)** : incubation privée (`zarafa-dev-io/pef`) jusqu'à la démonstration des critères de succès (§10) sur le pilote. La licence, le nom définitif et la gouvernance seront choisis au moment de l'ouverture, sur un modèle stabilisé par l'usage. À réévaluer après le pilote.
- **QO-2** — ~~Versioning sémantique des Assets~~ **Tranchée (v0.11.0, DEC-003)** : MAJEUR = le sens change et l'aval doit être revu ; MINEUR = ajout ou précision compatible ; PATCH = forme. Un bump majeur amont n'invalide **jamais** automatiquement les statuts aval : l'outillage détecte et signale (EF-33), l'humain décide — le CLI ne réécrit aucun Asset. La détection outillée (mémorisation de la version amont revue) est prévue à partir du lot 2 ; d'ici là, `pef impact <ID>` couvre le besoin manuellement.
- **QO-3** — ~~Projet pilote~~ **Tranchée (v0.5.0)** : pilote principal = l'IDE VS Code en TypeScript ; contre-pilote mainframe COBOL au lot 4 (voir §4, « Projet pilote »). À formaliser dans une Decision (`DEC-`).
- **QO-4** — Les `AcceptanceCriteria` en Gherkin obligatoire, ou format libre avec Gherkin recommandé ?
- **QO-5** — Nommage définitif des préfixes d'IDs et des suffixes de fichiers (EF-35), et politique de renumérotation interdite : à figer dans une Decision avant le premier pilote.
- **QO-6** — ~~Priorisation~~ **Tranchée (v0.12.0, DEC-004)** : champ optionnel `priority: Must | Should | Could | Wont` sur les WorkItems, exploitable par les Processors ; l'ordonnancement fin (ordre total) reste à l'outil d'exécution via `externalRef`. Pas d'Asset `Backlog` dédié.
- **QO-7** — ~~La Roadmap~~ **Tranchée (v0.13.0, DEC-005)** : un Asset `RM-` par élément de roadmap (thème × horizon, avec critère de sortie), chaque élément `satisfies` son Goal, les Epics `satisfies` l'élément précis. La vue d'ensemble est le répertoire `product/roadmap/`, pas un Asset agrégateur.
- **QO-8** — Accès au code pour la rétro-doc : le code source vit hors du repo PEF — les Processors y accèdent comment (workspace multi-root VS Code, chemin configuré, extraits fournis) et les `codeRefs` survivent-ils aux refactorings ?
- **QO-10** — À clarifier avec zDevOps : qu'est-il exécutable dans les GitHub Actions SG — script embarqué au repo, binaire externe, actions du marketplace ? La réponse conditionne l'activation du mode CI-renfort ; le mode local reste la base garantie.
- **QO-9** — ~~Accès IA en CI~~ **Tranchée (v0.6.1)** : pas d'appel IA possible depuis la CI en contexte SG à ce stade — déclencheur en deux temps (EF-31) : signalement déterministe en CI, exécution locale du Processor. À réévaluer si la contrainte est levée.
