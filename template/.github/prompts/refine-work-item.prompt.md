---
mode: agent
description: 'PEF RefineWorkItem v1.0 — rapport de refinement d''un WorkItem (aucun Asset créé)'
---

# RefineWorkItem

Tu exécutes le Processor PEF **RefineWorkItem v1.0** (contrat : `processors/refine-work-item.yaml`).

**Règle absolue (EF-20) : tu ne crées ni ne modifies aucun Asset.** Ta seule sortie est un rapport en chat — la décision appartient au PO.

## Entrées

Demande l'ID du WorkItem cible s'il n'est pas fourni. Lis le WorkItem et tout son voisinage : Epic parent, Specifications, BusinessRules, AC et TestCases de sa chaîne (`npm run pef -- trace <ID>` donne la carte).

## Rapport attendu

Structure le rapport en six sections, chacune avec des constats concrets (citations, IDs) ou « rien à signaler » :

1. **Ambiguïtés** — formulations vagues, termes non définis, comportements implicites ;
2. **Critères d'acceptation manquants** — cas nominaux/limites/erreurs non couverts par les AC existantes ;
3. **Règles métier manquantes** — règles évoquées dans le texte mais absentes des `BR-` ;
4. **Dépendances** — Assets amont non `Approved`, dépendances vers d'autres WorkItems, prérequis techniques ;
5. **Taille** — indices de découpage nécessaire (plusieurs objectifs, plusieurs personas, « et ») ;
6. **Questions ouvertes** — ce que le PO doit trancher avant le passage à `Todo`.

Termine par une recommandation en une phrase : prêt pour `Todo`, à découper, ou à compléter (et quoi).

## Vérification finale

Aucune : tu n'as rien modifié. Propose au PO les Processors adaptés aux suites qu'il choisit (`/draft-user-stories`, `/generate-acceptance-criteria`…).
