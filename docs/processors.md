# Les Processors

Un **Processor** est une capacité d'analyse, de création ou de transformation de Product Assets. Ça peut être un prompt IA, un script, un service — ou un humain. PEF définit le **contrat** (ce qui entre, ce qui sort), jamais l'implémentation : c'est ce qui rend chaque Processor **remplaçable** sans toucher aux Assets.

## Pour les novices : comment ça se présente concrètement ?

Au MVP, les Processors sont des **prompt files GitHub Copilot** : des fichiers `.prompt.md` rangés dans `.github/prompts/` de votre repo. Concrètement :

1. Ouvrez votre projet PEF dans VS Code (le **dossier**, pas un fichier isolé).
2. Ouvrez le chat Copilot (`Ctrl+Alt+I` ou l'icône chat).
3. Tapez `/` : la liste des prompts du repo apparaît (`/generate-acceptance-criteria`, `/refine-work-item`…).
4. Choisissez-en un, précisez la cible (ex. `SPEC-001`), envoyez.

Le Processor **lit alors les Assets directement dans le repo** — vous n'avez rien à copier-coller — et produit soit de nouveaux fichiers d'Assets, soit un rapport dans le chat. Vous gardez la main à chaque étape : Copilot vous montre les fichiers qu'il propose de créer avant d'écrire.

> Le prompt n'apparaît pas en tapant `/` ? Vérifiez que le dossier ouvert contient bien `.github/prompts/` et que l'extension Copilot est à jour.

## Le contrat (EF-16)

Chaque Processor est déclaré dans `processors/*.yaml` :

```yaml
processor: GenerateTestCases        # son nom
version: "1.0"                      # sa version (tracée dans la provenance ai:)
description: >-
  Rédige les cas de test exécutables d'un plan de recette.
inputs: [TestPlan, AcceptanceCriteria]    # ce qu'il consomme (des assetTypes)
outputs: [TestCase]                       # ce qu'il produit (assetTypes, ou Report)
activities: [Préparer la recette]         # à quelles activités il contribue
implementation:
  type: copilot-prompt                    # l'implémentation de référence…
  path: .github/prompts/generate-test-cases.prompt.md   # …substituable
```

Deux familles de sorties :

- **des Assets** — toujours créés en `status: Generated` avec leur provenance ;
- **`Report`** — un rapport en chat, *aucun fichier créé* : pour les analyses où la décision doit rester humaine (refinement, cérémonies).

## Les 21 Processors livrés

### Démarrage

| Prompt | Entrées → Sorties | Ce qu'il fait |
|---|---|---|
| `/start-project` | choix du point de départ → **Report** | Le point d'entrée d'un nouveau projet : diagnostic du dépôt, puis parcours guidé — **de zéro** (vision → backlog → specs → tests) ou **depuis un code existant** (rétro-doc d'abord, puis l'amont). Orchestre les Processors spécialisés, ne crée aucun Asset lui-même |

### Chaîne de test (lot 1)

| Prompt | Entrées → Sorties | Ce qu'il fait |
|---|---|---|
| `/generate-acceptance-criteria` | Specification + BR + NFR → AC | Dérive les critères : cas nominaux, limites, erreurs — chaque message d'erreur de la spec devient un scénario |
| `/generate-test-plan` | Specification + AC → TestPlan | Périmètre, stratégie, matrice AC → TestCases |
| `/generate-test-cases` | TestPlan + AC → TestCase | Cas exécutables par un testeur qui ne connaît pas le produit : préconditions, étapes, résultat attendu |

### Backlog (lot 2)

| Prompt | Entrées → Sorties | Ce qu'il fait |
|---|---|---|
| `/draft-epics` | Roadmap + Requirements → Epics | Découpe un périmètre en thèmes livrables, priorité MoSCoW justifiée |
| `/draft-user-stories` | Epic + Specifications → US + AC | Découpe un Epic ; signale les zones sans spec au lieu d'inventer |
| `/qualify-bug` | description brute → Bug + TC | Reformule (observé vs attendu), identifie les Assets défaillants (`impacts`), propose le test de non-régression (`dependsOn`) |
| `/refine-work-item` | WorkItem → **Report** | Ambiguïtés, AC manquants, règles absentes, dépendances, taille, questions — et une recommandation ; **ne crée rien** |

### Amont et cérémonies (lot 3)

| Prompt | Entrées → Sorties | Ce qu'il fait |
|---|---|---|
| `/draft-vision` | notes libres (+ Personas) → Vision + Goals | Structure la matière brute ; Goals mesurables ; non-objectifs explicités |
| `/draft-roadmap` | Vision + Goals → éléments de Roadmap | Un Asset par élément (DEC-005), critère de sortie inclus |
| `/draft-persona` | notes d'entretiens → Persona | Fidèle aux notes ; les hypothèses non étayées sont signalées, pas affirmées |
| `/prepare-sprint-planning` | WorkItems + Goals → **Report** | Candidats prêts triés, dépendances, risques, agenda — jamais de capacité/vélocité |
| `/prepare-sprint-review` | WorkItems + AC + Roadmap → **Report** | Livré vs prévu, scénarios de démo tirés des AC, impact roadmap |
| `/draft-release-notes` | WorkItems `Validated` + AC → Release | Langage métier ; seuls les WorkItems validés entrent |

### Documentation et rétro-documentation (lot 4)

| Prompt | Entrées → Sorties | Ce qu'il fait |
|---|---|---|
| `/reconstruct-technical-doc` | code (workspace) → Documentation Technical | Composants, points d'entrée, flux, dépendances — chaque affirmation référencée (`codeRefs`) ; incohérences signalées, jamais lissées |
| `/extract-business-rules` | code (workspace) → BusinessRules | Une règle par Asset, avec `certainty: observed` (lue dans le code) ou `inferred` (déduite — validation métier requise) |
| `/reconstruct-functional-doc` | Doc technique + BR → Documentation Functional | Le « quoi » métier depuis le « comment » technique ; l'`inferred` est marqué « sous réserve » |
| `/refresh-documentation` | Documentation → **Report** | Écarts : Assets modifiés depuis l'approbation, sections périmées, règles disparues du code |
| `/enrich-documentation` | WorkItem validé + Docs périmées → Documentation | L'étape 2 d'EF-31 : réécrit les sections touchées, rafraîchit `coveredVersions` — déclenchée par l'humain, jamais par la CI |
| `/draft-onboarding-guide` | le graphe d'Assets → Documentation Onboarding | Parcours de lecture ordonné et commenté, par profil métier/technique |
| `/draft-regression-test-plan` | Doc reconstruite + BR (+ code) → TestPlan + TestCases | **Tests de caractérisation** : fige le comportement observé d'un existant sans spec ni AC — le TP `verifies` la doc fonctionnelle, chaque TC `verifies` la règle qu'il fige ; les comportements suspects sont signalés en candidats bugs, jamais « corrigés » dans le test |

Prérequis rétro-doc (DEC-006) : le code est ouvert dans le **même workspace VS Code** que le repo PEF ; les `codeRefs` sont préfixés du nom du dossier repo (`clientis-app/src/clients/rules.ts:18-42`).

## Le circuit complet d'une génération

```
 1. /generate-acceptance-criteria SPEC-001          (vous, dans le chat)
 2. Le Processor lit SPEC-001, BR-001, NFR-001      (dans le repo)
 3. Il crée AC-003, AC-004 en status: Generated     (avec bloc ai:)
 4. npm run pef -- validate                          → tout est conforme ?
 5. npm run pef -- signal --apply                    → issues « review-required »
 6. Vous ouvrez une PR et relisez                    (corriger / rejeter / garder)
 7. Generated → Review → Approved                    (2 commits ; PEF008 bloque le saut)
 8. ai.reviewed: true + reviewedBy + reviewedAt      (la provenance est complète)
 9. La CI valide la PR ; au merge, signal ferme les issues
```

Chaque étape laisse une trace dans Git : c'est l'auditabilité demandée par la gouvernance (« qui a généré quoi, qui a validé quoi »).

## Les invariants que tout Processor respecte

1. Sorties en `status: Generated` + bloc `ai:` complet — jamais un Asset qui se fait passer pour humain ;
2. IDs au **premier numéro libre** du préfixe, jamais réutilisés ;
3. nommage `<ID>-<slug>.<suffixe>.md` (EF-35) ;
4. **aucune référence inventée** : ne lier que des IDs existants ;
5. la validation est exécutée en fin de run et les erreurs corrigées ;
6. les Processors `Report` ne créent ni ne modifient **aucun** fichier.

Ces invariants sont rappelés à l'IA par les instructions du repo (`.github/copilot-instructions.md` et `.github/instructions/*.instructions.md`, ciblées par suffixe de fichier).

## Écrire votre propre Processor

1. **Déclarez le contrat** dans `processors/mon-processor.yaml` (nom, version, inputs, outputs, activité).
2. **Implémentez** : le plus simple est un prompt file — copiez un existant dans `.github/prompts/`, gardez sa structure (Entrées / Travail attendu / Sorties / Vérification finale).
3. **Respectez les invariants** ci-dessus — la section « Sorties » de votre prompt doit les rappeler explicitement.
4. Testez sur l'exemple, puis committez : le Processor est versionné comme tout le reste.

## Remplacer un Processor (la promesse AI-agnostic)

Le contrat est indépendant de l'implémentation : demain, `GenerateTestCases` peut être un prompt Claude, un script, un agent interne — tant qu'il consomme TestPlan + AC et produit des TestCases conformes, **les Assets ne changent pas**. C'est le critère de succès n° 9 du MVP, et la protection contre l'obsolescence des outils : *les méthodes changent, les outils changent, les IA changent — les Product Assets restent.*
