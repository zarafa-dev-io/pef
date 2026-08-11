# Les concepts PEF

> Résumé opérationnel du [manifeste](manifeste-pef.md), qui reste la référence complète.

## PEF en une minute

Aujourd'hui, la connaissance d'un produit est éparpillée : la vision dans un PowerPoint, les exigences dans Jira, les specs dans Confluence, les tests dans un outil de test, les décisions dans des emails. Personne — ni humain ni IA — n'en a une vue complète et à jour.

PEF propose de ranger toute cette connaissance au même endroit, **dans un dépôt Git**, sous forme de petits fichiers markdown reliés entre eux : les **Product Assets**. Chaque fichier est lisible par un humain (c'est du texte) et exploitable par une machine (grâce à sa carte d'identité structurée, le *front matter*). Les IA ne portent plus le contexte : elles le **lisent dans les Assets**, et ce qu'elles produisent redevient des Assets, relus par vous.

> **Le contexte ne doit pas être enfermé dans l'agent. Il doit être présent dans les Product Assets.**

## Les cinq concepts

```
                         PEF
                          │
        ┌──────────────────┼─────────────────┐
        │                 │                 │
      ASSETS          ACTIVITIES        PROCESSORS
        │                 │                 │
     Knowledge           Work          AI / Tools
        │                 │                 │
        └──────────────────┼─────────────────┘
                          │
                        ROLES
```

| Concept | Définition | Exemple concret |
|---|---|---|
| **Product Asset** | Un fichier markdown de connaissance : identifié (`SPEC-001`), versionné (semver), relié aux autres | La spec « création d'une fiche client » |
| **Role** | Des responsabilités, pas des personnes — une personne peut cumuler PO + BA ; trois personnes peuvent partager le rôle QA | Product Owner, QA, Architecte |
| **Activity** | Ce que l'humain cherche à accomplir | Le refinement de jeudi, le sprint planning |
| **Processor** | Une capacité qui lit/produit des Assets, déclarée par un contrat entrées → sorties | `GenerateTestCases` (TestPlan + AC → TC) |
| **Relationship** | Un lien typé entre deux Assets | `AC-001 refines SPEC-001` |

## Activity ≠ Processor : la distinction fondamentale

L'**Activity** est le but humain ; le **Processor** est un outil qui y contribue. PEF n'automatise pas le sprint planning : il le **prépare**, et l'humain décide.

```
Activity : Sprint Planning
        ├── Humain : décide du Sprint Goal, sélectionne les WorkItems
        └── Processors : PrepareSprintPlanning (rapport : candidats prêts,
                         dépendances, risques, agenda proposé)
```

La plupart des approches IA commencent par « quel agent allons-nous créer ? ». PEF commence par « **quelle activité voulons-nous améliorer, quels Assets lui faut-il, et quelle responsabilité reste humaine ?** »

## Anatomie d'un Asset

```yaml
---
pefVersion: "0.1"               # ┐
assetType: AcceptanceCriteria   # │ carte d'identité structurée
id: AC-001                      # │ = le front matter,
title: Création nominale        # │ lu par les outils
status: Approved                # │
version: 1.0.0                  # │
refines: [SPEC-001]             # ┘ ← la relation qui le place dans le graphe
---
# Création nominale d'une fiche client       ← contenu libre, pour les humains

Étant donné qu'aucun client n'existe avec l'email "marie@exemple.fr" ...
```

Un Asset est **petit** (un critère, un cas de test = un fichier) : c'est ce qui le rend adressable, révisable et générable individuellement.

## Le graphe d'Assets

Chaque relation déclarée tisse un graphe qui couvre tout le produit :

```
Vision ← Goal ← Roadmap (1 Asset/élément) ← Epic ← UserStory
                                                      ↑
                                    {Requirement, BusinessRule, NFR}
                                                      ↑
                                     Specification ← AcceptanceCriteria
                                            ↑               ↑
                                        TestPlan   ←    TestCase
```

(Les flèches suivent les relations déclarées : l'aval pointe vers l'amont — une AC `refines` sa Spec, un TestCase `verifies` une AC.)

Ce graphe répond outillé aux questions qui coûtent si cher d'habitude : *quels tests couvrent cette exigence ?* (`pef trace`), *qu'est-ce que je casse si je change cette spec ?* (`pef impact`), *où sont les trous ?* (`pef coverage`).

## Human in the Loop : le circuit de confiance

Une production IA n'est **jamais** une vérité métier. Son cycle est outillé de bout en bout :

```
1. Vous lancez un Processor (ex. /generate-acceptance-criteria SPEC-001)
2. Il lit les Assets d'entrée dans le repo
3. Il produit des Assets en  status: Generated  + bloc de provenance ai:
4. pef signal ouvre une issue « review-required » par Asset généré
5. Vous relisez en PR : rejet, modification, ou approbation
6. Generated → Review → Approved  (le saut direct est bloqué : PEF008)
7. La provenance est complétée (reviewed: true, reviewedBy, reviewedAt)
8. L'issue se ferme automatiquement au signal suivant
```

Tout est auditable dans Git : qui a généré quoi, avec quel Processor, qui a validé, quand.

## Pourquoi Git ?

Parce que Git offre gratuitement ce que les outils documentaires promettent rarement : l'**historique** complet, les **branches** pour travailler sans casser, la **revue** par PR, l'**audit** (qui, quoi, quand), et l'**automatisation** (CI). Un changement de Requirement se suit commit par commit jusqu'aux tests impactés.

## Les principes directeurs

| Principe | Ce que ça veut dire concrètement |
|---|---|
| **Knowledge First** | On structure la connaissance avant d'automatiser quoi que ce soit |
| **Artifact First** | Les Assets sont le contrat d'échange entre humains, outils et IA |
| **Human in the Loop** | L'IA propose, l'humain décide — bloqué par l'outillage, pas juste promis |
| **AI Agnostic** | Le moteur ne fait aucun appel LLM ; Copilot est remplaçable par un autre Processor |
| **Methodology Agnostic** | Scrum, Kanban, hybride : PEF s'adapte, il n'impose rien |
| **Git Native** | Le repo est la seule source de vérité |
| **Traceability First** | Les relations comptent autant que les contenus |
| **Incremental Adoption** | On peut commencer par un seul rôle (PO) et une seule activité |

## Ce que PEF n'est pas

Ni un outil de ticketing (Jira reste l'outil d'exécution : sprints, capacité, ordre fin), ni un agent IA de plus, ni une méthodologie. C'est **la couche commune** qui permet à tout ce monde de collaborer autour des mêmes Assets.
