PEF — Product Engineering Framework

Product Requirements Document — v0.3

Version : 0.3
Statut : Draft
Langue : Français
Date : 08/08/2026

⸻

1. Résumé exécutif

PEF — Product Engineering Framework est un framework de Product Engineering augmenté par l’IA.

PEF permet aux organisations d’intégrer progressivement l’IA dans leur cycle de développement logiciel en s’appuyant sur un langage commun composé de :

* Product Assets ;
* Roles ;
* Activities ;
* Processors ;
* Relationships.

PEF ne cherche pas à remplacer les méthodologies existantes, les outils ou les agents IA.

Il fournit une couche d’interopérabilité entre eux.

Les méthodes changent. Les outils changent. Les IA changent. Les Product Assets restent.

⸻

2. Vision

L’IA transforme progressivement le développement logiciel.

Pourtant, la plupart des organisations ne peuvent pas simplement abandonner leurs méthodes, outils et processus existants.

Une entreprise peut utiliser :

* Scrum ;
* Kanban ;
* SAFe ;
* XP ;
* une méthode hybride ;
* un processus interne.

Elle peut également utiliser :

* GitHub Copilot ;
* Claude ;
* des agents propriétaires ;
* des outils spécialisés ;
* des scripts ;
* des plateformes de test ;
* des outils de gestion de projet.

Le problème n’est donc pas l’absence d’outils.

Le problème est l’absence d’un langage commun permettant à ces acteurs de collaborer autour de la connaissance du produit.

PEF propose cette couche commune.

⸻

3. Problème

La connaissance nécessaire au développement d’un produit est aujourd’hui fragmentée.

Elle peut être répartie entre :

Jira
Confluence
GitHub
Word
Excel
PowerPoint
Tests
Code
Emails
Teams / Slack
Documents personnels

Cette fragmentation entraîne :

* perte de contexte ;
* duplication de l’information ;
* difficultés de traçabilité ;
* incohérences entre documents ;
* difficulté à transmettre la connaissance ;
* dépendance aux personnes ;
* difficulté pour les IA à comprendre le contexte complet.

⸻

4. Le problème spécifique de l’IA

Les assistants IA sont très performants pour produire du contenu.

Mais leur efficacité dépend fortement du contexte qui leur est fourni.

Sans structure commune, chaque agent doit reconstruire son contexte à partir de :

* documents ;
* tickets ;
* conversations ;
* prompts ;
* conventions ;
* mémoire implicite des équipes.

Cela conduit à une multiplication de :

* prompts ;
* instructions ;
* agents spécialisés ;
* workflows propriétaires.

PEF propose de déplacer le centre de gravité :

Le contexte ne doit pas être enfermé dans l’agent. Il doit être présent dans les Product Assets.

⸻

5. Proposition de valeur

PEF transforme le référentiel produit en une base de connaissances structurée, versionnée et exploitable par les humains et les machines.

Cette base permet :

* de conserver la connaissance ;
* de la versionner ;
* de la relier ;
* de la valider ;
* de la transformer ;
* de la tracer ;
* de l’exploiter avec différentes IA ;
* de changer d’outil sans perdre la connaissance.

⸻

6. Le modèle PEF

PEF repose sur cinq concepts structurants.

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
                          │
                     ORGANIZATION

Les relations permettent de connecter l’ensemble.

⸻

7. Product Assets

Les Product Assets représentent la connaissance persistante du produit.

Exemples :

Vision
Goal
Objective
Persona
Problem
Hypothesis
Roadmap
Backlog
WorkItem
Requirement
BusinessRule
NonFunctionalRequirement
Specification
AcceptanceCriteria
TestPlan
TestCase
Decision
Increment
Release

Les assets sont :

* lisibles par les humains ;
* exploitables par les machines ;
* versionnables ;
* identifiables ;
* référencables ;
* traçables.

Le Markdown constitue le format humain privilégié.

Le Front Matter YAML contient les métadonnées structurées.

⸻

8. Markdown comme contrat

Un Product Asset peut être représenté sous la forme :

---
pefVersion: "0.1"
assetType: Requirement
id: REQ-042
title: Gestion d'un client
status: Draft
version: 1.0.0
---
# Gestion d'un client
...

Le même asset peut être utilisé par :

* un humain ;
* VS Code ;
* GitHub ;
* GitHub Copilot ;
* un agent IA ;
* un outil de validation ;
* un outil de génération de tests ;
* un outil de visualisation.

Le Markdown constitue ainsi le contrat d’échange.

⸻

9. Roles

PEF distingue le Role de la personne qui l’exerce.

Un Role représente un ensemble de responsabilités et d’activités.

Exemples :

Product

* Product Manager ;
* Product Owner ;
* Business Analyst ;
* Project Manager.

Design

* UX Designer ;
* UI Designer ;
* UX Researcher.

Engineering

* Architecte ;
* Tech Lead ;
* Développeur.

Quality

* QA Engineer ;
* Test Manager.

Delivery

* DevOps ;
* Platform Engineer ;
* SRE ;
* Release Manager.

Agile

* Scrum Master ;
* Agile Coach.

Governance

* Security ;
* Compliance ;
* Risk.

PEF ne nécessite pas qu’un rôle corresponde à une personne dédiée.

⸻

10. Personnes et rôles

PEF distingue :

Person
Role

Une personne peut exercer plusieurs rôles.

Exemple :

Jean
 ├── Product Owner
 └── Business Analyst

Plusieurs personnes peuvent exercer un même rôle :

Product Owner
 ├── Jean
 ├── Marie
 └── Sophie

Cette distinction permet à PEF de s’adapter aux organisations de tailles différentes.

⸻

11. Organisation variable

PEF ne présuppose aucune organisation cible.

Petite équipe

3 personnes
PO + BA
Architect + Developer
QA + DevOps

Organisation intermédiaire

PO
BA
UX
Architect
Developers
QA
DevOps

Grande organisation

Product Managers
PO
BA
UX
Architects
Tech Leads
Developers
QA
DevOps
Release Managers

Le modèle PEF reste identique.

Seule l’attribution des rôles change.

⸻

12. Role Coverage

PEF doit pouvoir identifier les responsabilités couvertes par l’organisation.

Exemple :

Product Owner
████████████████████ 100%
Business Analysis
████████████████░░░░ 80%
QA
██████████░░░░░░░░░░ 50%

PEF doit pouvoir détecter :

* une activité sans responsable ;
* une responsabilité non couverte ;
* une dépendance à une seule personne ;
* une surcharge de rôle ;
* une activité couverte uniquement par l’IA.

Cette fonctionnalité pourra constituer une extension de gouvernance.

⸻

13. Activities

Une Activity représente une activité réelle réalisée par un rôle.

Exemples :

Product Owner

* Discovery ;
* Backlog Refinement ;
* Sprint Planning ;
* Sprint Review ;
* Roadmap Planning ;
* Release Preparation ;
* Stakeholder Preparation ;
* Prioritization.

QA

* Test Planning ;
* Test Design ;
* Test Review ;
* Regression Preparation ;
* Quality Review.

Architecte

* Architecture Review ;
* Solution Design ;
* ADR Preparation ;
* Architecture Decision Review.

⸻

14. Activity ≠ Processor

Cette distinction est fondamentale.

Activity

Ce que l’humain cherche à accomplir.

Processor

Ce qu’un humain, un outil ou une IA peut faire pour contribuer à cette activité.

Exemple :

Activity : Sprint Planning
        │
        ├── Human
        │     ├── décide du Sprint Goal
        │     └── sélectionne les WorkItems
        │
        └── Processors
              ├── AnalyzeBacklog
              ├── DetectDependencies
              ├── DetectRisks
              └── PrepareAgenda

⸻

15. Processors

Un Processor est une capacité permettant d’analyser, créer ou transformer des Product Assets.

Il peut être :

* un humain ;
* un agent IA ;
* un Skill ;
* un Prompt ;
* un MCP Server ;
* un CLI ;
* un script ;
* un outil ;
* un service.

PEF définit le contrat d’un Processor mais pas son implémentation.

⸻

16. Contrat Processor

Exemple :

processor: GenerateTestPlan
version: 1.0
inputs:
  - Specification
  - AcceptanceCriteria
  - BusinessRule
  - NonFunctionalRequirement
outputs:
  - TestPlan
  - TestCase

Cette déclaration permet à un outil ou un orchestrateur de déterminer :

* ce que le Processor consomme ;
* ce qu’il produit ;
* dans quelles Activities il peut intervenir.

⸻

17. Human in the Loop

L’humain reste responsable des décisions métier.

Un Processor peut produire une proposition :

Asset
  │
  ▼
Processor
  │
  ▼
Proposition
  │
  ▼
Revue humaine
  │
  ├── Rejet
  ├── Modification
  └── Approbation

Une sortie générée par l’IA ne doit jamais être considérée automatiquement comme une vérité métier.

⸻

18. Provenance IA

PEF doit permettre de conserver la provenance d’une production IA.

ai:
  generated: true
  processor: GenerateTestPlan
  processorVersion: 1.2
  reviewed: false

Après revue :

ai:
  generated: true
  processor: GenerateTestPlan
  processorVersion: 1.2
  reviewed: true
  reviewedBy: ROLE-PO
  reviewedAt: 2026-08-08

⸻

19. Cérémonies et activités

PEF doit pouvoir assister les cérémonies existantes sans imposer une méthodologie.

Exemples :

Sprint Planning
Sprint Review
Sprint Retrospective
Backlog Refinement
Daily
Release Planning
Architecture Review
Test Review

Chaque cérémonie peut être modélisée comme une Activity.

⸻

20. Exemple : Sprint Planning

Role
Product Owner
    │
    ▼
Activity
Sprint Planning
    │
    ├── Inputs
    │     ├── Goal
    │     ├── Backlog
    │     ├── WorkItems
    │     └── DefinitionOfDone
    │
    ├── AI Assistance
    │     ├── AnalyzeBacklog
    │     ├── DetectDependencies
    │     ├── DetectRisks
    │     └── PrepareAgenda
    │
    └── Human Decisions
          ├── Sprint Goal
          └── WorkItem Selection

PEF peut préparer la cérémonie mais ne la décide pas.

⸻

21. Exemple : Sprint Review

PEF peut exploiter :

* Increment ;
* WorkItems ;
* Acceptance Criteria ;
* résultats des tests ;
* Release ;
* Roadmap.

Il peut préparer :

* agenda ;
* scénarios de démonstration ;
* éléments livrés ;
* éléments incomplets ;
* impact roadmap ;
* questions stakeholders.

⸻

22. Exemple : Backlog Refinement

PEF peut analyser les WorkItems et identifier :

* ambiguïtés ;
* critères d’acceptation manquants ;
* Business Rules manquantes ;
* NFR manquantes ;
* dépendances ;
* risques ;
* taille excessive ;
* questions ouvertes.

Le PO conserve la décision finale.

⸻

23. Exemple : génération des tests fonctionnels

Une capacité centrale de PEF-PO/PEF-QA est de pouvoir dériver les tests des spécifications.

Flux cible :

Requirement
     │
     ▼
Specification
     │
     ▼
AcceptanceCriteria
     │
     ▼
TestPlan
     │
     ▼
TestCase

Un Processor peut analyser :

* la spécification ;
* les règles métier ;
* les critères d’acceptation ;
* les NFR ;
* les scénarios nominaux ;
* les cas limites ;
* les erreurs attendues.

Il produit ensuite :

* Test Plan ;
* Test Cases ;
* données de test ;
* couverture ;
* traçabilité.

⸻

24. Traçabilité

PEF doit permettre une traçabilité bidirectionnelle.

Exemple :

Vision
  ↓
Goal
  ↓
Roadmap
  ↓
WorkItem
  ↓
Requirement
  ↓
Specification
  ↓
AcceptanceCriteria
  ↓
TestPlan
  ↓
TestCase
  ↓
Increment
  ↓
Release

PEF doit pouvoir répondre à :

* Quelle exigence justifie ce test ?
* Quels tests couvrent cette Feature ?
* Quelle Business Rule est impactée ?
* Quels WorkItems n’ont pas de critères d’acceptation ?
* Quelles exigences ne sont pas couvertes ?
* Quels tests sont impactés par une modification de spécification ?

⸻

25. PEF Asset Graph

Les Assets et leurs relations constituent un graphe de connaissance.

                   Vision
                     │
                    Goal
                     │
                 Objective
                     │
                  Roadmap
                     │
                 WorkItem
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
     Requirement  Rule         NFR
          │          │          │
          └──────────┼──────────┘
                     ▼
                Specification
                     │
              AcceptanceCriteria
                     │
                  TestPlan
                     │
                  TestCase
                     │
                  Increment
                     │
                   Release

Ce graphe doit être exploitable par les humains et les machines.

⸻

26. Méthodologies

PEF ne définit pas de méthodologie.

Des Profiles permettent de mapper des méthodologies existantes vers PEF.

PEF Core
   │
   ├── Scrum Profile
   ├── Kanban Profile
   ├── XP Profile
   ├── SAFe Profile
   └── Enterprise Profile

⸻

27. Compatibilité avec les frameworks existants

PEF doit pouvoir fonctionner avec des frameworks externes dès lors qu’ils savent exploiter les mêmes Assets en entrée et/ou en sortie.

Exemples :

PEF
 │
 ├── GitHub Copilot
 ├── BMAD
 ├── Claude
 ├── Custom Agents
 ├── MCP
 └── Enterprise AI

PEF ne cherche pas à remplacer ces systèmes.

Ils peuvent devenir des Processors ou des orchestrateurs utilisant les Product Assets PEF.

⸻

28. PEF et BMAD

PEF adopte une position complémentaire.

BMAD peut fournir :

* agents ;
* workflows ;
* prompts ;
* méthodologie d’exécution.

PEF fournit :

* Assets ;
* relations ;
* Activities ;
* Roles ;
* contrats d’entrée/sortie.

Ainsi :

BMAD
  │
  ▼
PEF Assets
  │
  ▼
Autres Agents / Outils

Un même Asset peut donc être exploité par plusieurs frameworks.

⸻

29. Premier profil : PEF-PO

Le premier domaine fonctionnel de PEF sera le Product Owner.

PEF-PO doit couvrir progressivement :

Discovery
Vision
Roadmap
Backlog Management
Backlog Refinement
Prioritization
Sprint Planning
Sprint Review
Release Preparation
Stakeholder Management
Product Quality

PEF-PO ne doit pas être une simple collection de prompts.

Il doit constituer un environnement permettant au PO de préparer et réaliser ses activités.

⸻

30. PEF-PO : exemple d’espace de travail

PEF-PO
│
├── Product
│   ├── Vision
│   ├── Goals
│   ├── Roadmap
│   └── Backlog
│
├── Activities
│   ├── Discovery
│   ├── Refinement
│   ├── Sprint Planning
│   ├── Sprint Review
│   └── Release
│
├── Assets
│
└── AI
    ├── Prompts
    ├── Skills
    ├── Instructions
    └── Templates

⸻

31. Architecture d’un dépôt PEF

Une organisation cible pourrait être :

product/
│
├── vision/
├── goals/
├── roadmap/
├── backlog/
├── requirements/
├── specifications/
├── acceptance-criteria/
├── quality/
│
├── decisions/
├── releases/
│
├── activities/
│
├── roles/
│
├── ai/
│   ├── prompts/
│   ├── skills/
│   ├── instructions/
│   ├── templates/
│   └── agents/
│
├── profiles/
│
└── schemas/

Cette structure est indicative.

PEF doit définir le contrat, pas imposer une arborescence unique lorsque cela n’est pas nécessaire.

⸻

32. Assets IA

Les ressources nécessaires à l’utilisation des IA doivent également pouvoir être versionnées.

Exemples :

ai/
├── prompts/
├── skills/
├── instructions/
├── templates/
├── agents/
└── examples/

Elles peuvent être associées à :

* un Role ;
* une Activity ;
* un Processor ;
* un Asset Type ;
* un Profile.

⸻

33. Git Native

PEF est conçu pour fonctionner naturellement avec Git.

Avantages :

* historique ;
* branches ;
* pull requests ;
* code review ;
* audit ;
* collaboration ;
* automatisation CI/CD.

Un changement de Requirement peut ainsi être suivi jusqu’aux Specifications et Tests associés.

⸻

34. Validation

Un validateur PEF doit pouvoir contrôler :

Structure

* Front Matter ;
* types ;
* identifiants ;
* propriétés obligatoires.

Relations

* références valides ;
* dépendances ;
* relations autorisées.

Cohérence

* statuts ;
* versions ;
* types ;
* profils.

Traçabilité

* couverture ;
* assets orphelins ;
* tests manquants ;
* références cassées.

⸻

35. Organisation et IA

PEF doit permettre de représenter plusieurs niveaux d’assistance.

Niveau 1 — Humain seul

Person
  ↓
Activity
  ↓
Assets

Niveau 2 — Assistance IA

Person
  ↓
Activity
  ├── Human
  └── AI Processor

Niveau 3 — Collaboration

Person
  ↕
AI
  ↕
Assets

Niveau 4 — Automatisation contrôlée

Activity
   ↓
Processor
   ↓
Proposed Asset
   ↓
Human Approval

PEF doit permettre une adoption progressive de ces niveaux.

⸻

36. Principes d’adoption

PEF doit respecter les principes suivants :

1. Ne pas imposer une nouvelle méthodologie

PEF complète les méthodes existantes.

2. Ne pas imposer une nouvelle organisation

Les rôles peuvent être regroupés ou distribués.

3. Ne pas imposer un fournisseur IA

PEF est AI agnostic.

4. Commencer par un rôle

Une organisation peut commencer avec PEF-PO.

5. Commencer par une activité

Une organisation peut commencer par le Refinement ou le Sprint Planning.

6. Conserver l’humain dans la boucle

L’IA assiste les décisions sans s’en approprier la responsabilité.

7. Capitaliser la connaissance

Les résultats deviennent des Assets réutilisables.

⸻

37. Roadmap produit indicative

Phase 1 — PEF Core

Définir :

* Asset Model ;
* Role ;
* Activity ;
* Processor ;
* Relationships ;
* Front Matter ;
* JSON Schema ;
* validation.

⸻

Phase 2 — PEF Repository

Définir :

* structure de repository ;
* conventions de nommage ;
* références ;
* identifiants ;
* conventions Git ;
* CI validation.

⸻

Phase 3 — PEF-PO

Construire les premières Activities :

* Vision ;
* Roadmap ;
* Backlog ;
* Refinement ;
* Sprint Planning ;
* Sprint Review ;
* Release Preparation.

⸻

Phase 4 — Functional Testing

Construire :

Specification
      ↓
AcceptanceCriteria
      ↓
TestPlan
      ↓
TestCase

avec des Skills/Processors compatibles GitHub Copilot.

⸻

Phase 5 — PEF-QA

Étendre le modèle aux activités QA :

* Test Planning ;
* Test Design ;
* Test Review ;
* Regression ;
* Quality Review.

⸻

Phase 6 — PEF-UX / Architecture / Development

Ajouter progressivement :

* UX ;
* Architecture ;
* Development ;
* Delivery.

⸻

38. MVP

Le MVP de PEF ne doit pas chercher à couvrir tout le SDLC.

Il doit démontrer une boucle complète :

Product Owner
      ↓
Activity
      ↓
Product Asset
      ↓
AI Processor
      ↓
Human Review
      ↓
New Product Asset
      ↓
Traceability

Le cas d’usage prioritaire est :

À partir d’une spécification validée, aider le PO/QA à produire et maintenir les critères d’acceptation, le Test Plan et les Tests fonctionnels.

⸻

39. Critères de succès du MVP

Le MVP sera considéré comme réussi si un utilisateur peut :

1. créer un Product Asset Markdown ;
2. le valider automatiquement ;
3. le référencer depuis un autre Asset ;
4. lancer un Processor ;
5. obtenir une proposition générée par l’IA ;
6. modifier cette proposition ;
7. la valider ;
8. retrouver la traçabilité entre les Assets ;
9. utiliser un autre Processor sans modifier les Assets ;
10. travailler dans Git.

⸻

40. Indicateurs de succès

PEF pourra mesurer :

Adoption

* nombre de projets PEF ;
* nombre de rôles couverts ;
* nombre d’Activities utilisées.

Knowledge

* nombre d’Assets ;
* taux d’Assets correctement référencés ;
* taux d’Assets orphelins.

Quality

* couverture des Requirements ;
* couverture des Acceptance Criteria ;
* couverture des Tests.

AI

* nombre de Processors utilisés ;
* taux d’acceptation des propositions IA ;
* taux de modifications humaines ;
* temps économisé.

⸻

41. Positionnement

PEF n’est :

* ni un outil de gestion de projet ;
* ni un nouvel outil de ticketing ;
* ni un LLM ;
* ni un agent unique ;
* ni une méthode Agile ;
* ni un remplacement de GitHub ;
* ni un remplacement de Copilot.

PEF est :

une couche commune permettant aux humains, aux méthodes, aux outils et aux IA de collaborer autour des Product Assets.

⸻

42. Différenciation

La différenciation de PEF repose sur quatre éléments :

                    PEF
                     │
        ┌────────────┼────────────┐
        │            │            │
      Roles       Activities     Assets
        │            │            │
        └────────────┼────────────┘
                     │
                 Processors

La plupart des approches commencent par :

« Quel agent IA allons-nous créer ? »

PEF commence par :

« Quelle activité voulons-nous améliorer, quels assets sont nécessaires et quelle responsabilité reste humaine ? »

⸻

43. Vision long terme

PEF doit permettre de construire progressivement un écosystème :

                         PEF
                          │
          ┌───────────────┼───────────────┐
          │               │               │
       Profiles         Roles         Processors
          │               │               │
       Scrum             PO             Copilot
       Kanban            QA             Claude
       SAFe              UX             BMAD
       XP                Dev            MCP
                          │
                          ▼
                    Product Assets
                          │
                          ▼
                    Product Graph

L’objectif n’est pas de créer une IA qui fait tout.

L’objectif est de permettre à plusieurs humains et plusieurs IA de collaborer autour d’une même connaissance produit.

⸻

44. Principes directeurs

Knowledge First
La connaissance précède l’automatisation.

Artifact First
Les Product Assets constituent le contrat d’échange.

Role Centric
L’IA augmente les rôles et leurs activités.

Human in the Loop
L’humain conserve la responsabilité des décisions.

AI Agnostic
PEF ne dépend d’aucun fournisseur d’IA.

Methodology Agnostic
PEF s’adapte aux méthodologies existantes.

Git Native
La connaissance peut être versionnée et auditée.

Traceability First
Les relations entre les assets sont aussi importantes que les assets eux-mêmes.

Incremental Adoption
PEF peut être adopté progressivement.

Open Ecosystem
Tout outil capable de respecter les contrats PEF peut participer à l’écosystème.

⸻

45. Message produit

PEF augmente les personnes dans leurs activités de Product Engineering en utilisant les Product Assets comme langage commun entre humains, méthodes, outils et IA.

⸻

46. Baseline

Principale

Les méthodes changent. Les outils changent. Les IA changent. Les Product Assets restent.

Alternative

Humans and AI, working through shared Product Assets.

Positionnement court

PEF — le langage commun du Product Engineering augmenté par l’IA.

⸻

47. Statut du PRD

Ce document constitue le PRD de référence v0.3.

Les concepts suivants sont considérés comme structurants :

Organization
Person
Role
Activity
Processor
Product Asset
Relationship
Profile

La priorité de conception est désormais :

PEF Core
   ↓
PEF Repository
   ↓
PEF-PO
   ↓
Functional Test Generation
   ↓
PEF-QA
   ↓
Other Role Profiles

La prochaine étape consiste à transformer ces concepts en spécifications techniques formelles et testables.