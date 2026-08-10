# Les concepts PEF

> Résumé opérationnel du [manifeste](manifeste-pef.md) — la référence complète.

## Le problème

La connaissance produit est fragmentée (Jira, Confluence, Office, emails, mémoire des équipes). Les IA reconstruisent leur contexte à chaque usage, via des prompts et workflows propriétaires. PEF déplace le centre de gravité : **le contexte ne vit pas dans l'agent, il vit dans les Product Assets**.

## Les cinq concepts

```
                         PEF
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
      ASSETS          ACTIVITIES        PROCESSORS
        │                 │                 │
     Knowledge           Work          AI / Tools
        │                 │                 │
        └─────────────────┼─────────────────┘
                          │
                        ROLES
```

| Concept | Définition | Exemple |
|---|---|---|
| **Product Asset** | Connaissance persistante : markdown + front matter YAML, identifiée, versionnée, reliée | `SPEC-001`, `AC-002`, `DEC-003` |
| **Role** | Ensemble de responsabilités, distinct des personnes (une personne peut cumuler, un rôle peut être partagé) | Product Owner, QA |
| **Activity** | Ce que l'humain cherche à accomplir | Backlog Refinement, Sprint Planning |
| **Processor** | Ce qu'un humain, un outil ou une IA peut faire sur les Assets — déclaré par un contrat entrées/sorties | `GenerateTestCases`, `RefineWorkItem` |
| **Relationship** | Lien typé entre Assets, formant le graphe de traçabilité | `AC-001 refines SPEC-001` |

## Activity ≠ Processor

Distinction fondamentale : l'Activity est le **but humain**, le Processor est une **capacité contributive**.

```
Activity : Sprint Planning
        ├── Human : décide du Sprint Goal, sélectionne les WorkItems
        └── Processors : AnalyzeBacklog, DetectRisks, PrepareAgenda
```

## Le graphe d'Assets

```
Vision ← Goal ← Roadmap ← Epic ← UserStory ← {Requirement, BusinessRule, NFR}
                                                        ↑
                                              Specification ← AcceptanceCriteria
                                                        ↑            ↑
                                                    TestPlan  ←  TestCase
```

(Flèches = sens des relations déclarées : l'aval pointe vers l'amont. Voir la [référence](reference.md) pour le vocabulaire exact.)

## Human in the Loop

Une production IA n'est **jamais** une vérité métier :

```
Asset → Processor → Proposition (status: Generated, bloc ai:)
                         ↓
                   Revue humaine (PR)
                         ↓
              Rejet | Modification | Approbation
```

Le passage `Generated → Approved` direct est interdit par la validation (PEF008) ; le circuit passe par `Review`. La provenance (`ai.processor`, `ai.reviewedBy`…) reste dans le front matter — auditable dans Git.

## Principes directeurs

**Knowledge First** · **Artifact First** · **Role Centric** · **Human in the Loop** · **AI Agnostic** · **Methodology Agnostic** · **Git Native** · **Traceability First** · **Incremental Adoption** · **Open Ecosystem**

Concrètement : le moteur de validation ne fait aucun appel LLM ni réseau (NFR-1/2) ; les Processors sont substituables ; le repo Git est la seule source de vérité.
