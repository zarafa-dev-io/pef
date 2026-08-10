# Les Processors

Un **Processor** est une capacité d'analyse, de création ou de transformation de Product Assets. Il peut être un humain, un agent IA, un prompt, un script, un MCP server… PEF définit son **contrat**, pas son implémentation (NFR-1) : tout Processor est substituable sans toucher aux Assets.

## Le contrat (EF-16)

Chaque Processor est déclaré dans `processors/*.yaml` :

```yaml
processor: GenerateTestCases
version: "1.0"
description: >-
  Rédige les cas de test exécutables d'un plan de recette.
inputs: [TestPlan, AcceptanceCriteria]
outputs: [TestCase]
activities: [Préparer la recette]
implementation:
  type: copilot-prompt
  path: .github/prompts/generate-test-cases.prompt.md
```

`inputs`/`outputs` sont des assetTypes (ou `Report` pour une sortie sans Asset). L'implémentation de référence du MVP est un **prompt file GitHub Copilot** (`/nom-du-prompt` en chat VS Code) — remplaçable par tout outil respectant le même contrat.

## Les Processors livrés

### Chaîne de test (lot 1)

| Processor | Entrées → Sorties | Usage |
|---|---|---|
| `GenerateAcceptanceCriteria` | Specification + BR + NFR → AC | Dérive les critères : cas nominaux, limites, erreurs |
| `GenerateTestPlan` | Specification + AC → TestPlan | Périmètre, stratégie, matrice de couverture |
| `GenerateTestCases` | TestPlan + AC → TestCase | Cas exécutables : préconditions, étapes, résultat attendu |

### Backlog (lot 2)

| Processor | Entrées → Sorties | Usage |
|---|---|---|
| `DraftEpics` | Roadmap + Requirements → Epics | Découpe un périmètre en ensembles livrables |
| `DraftUserStories` | Epic + Specifications → US + AC | Découpe un Epic, AC incluses |
| `QualifyBug` | description brute (+ Spec/BR/AC) → Bug + TC | Qualifie, situe les Assets défaillants (`impacts`), propose le test de non-régression (`dependsOn`) |
| `RefineWorkItem` | WorkItem → **Report** | Rapport de refinement : ambiguïtés, AC manquants, dépendances, taille, questions — **ne crée aucun Asset** (EF-20) |

## Le circuit d'une génération

1. Le PO lance le prompt (`/draft-user-stories` …) dans VS Code.
2. Le Processor lit les Assets d'entrée **dans le repo** (pas de contexte recopié à la main).
3. Il produit des Assets en `status: Generated`, avec la provenance :
   ```yaml
   ai:
     generated: true
     processor: DraftUserStories
     processorVersion: "1.0"
     reviewed: false
   ```
4. `pef validate` + `pef coverage` contrôlent la production.
5. `pef signal` ouvre une issue `review-required` par Asset généré.
6. Revue humaine par PR : `Generated → Review → Approved` (le saut direct est bloqué, PEF008). Le bloc `ai:` est complété (`reviewed: true`, `reviewedBy`, `reviewedAt`).
7. L'issue se ferme automatiquement au `signal` suivant.

## Écrire un nouveau Processor

1. Déclarer le contrat YAML dans `processors/`.
2. Fournir l'implémentation (prompt file dans `.github/prompts/`, ou tout autre outil).
3. Respecter les invariants : sorties en `Generated` + bloc `ai:`, IDs au premier numéro libre, nommage EF-35, aucune référence inventée, validation exécutée en fin de run.

Un même contrat peut avoir plusieurs implémentations (Copilot, Claude, script…) : c'est le critère de succès n° 9 du MVP — changer d'outil sans modifier les Assets.
