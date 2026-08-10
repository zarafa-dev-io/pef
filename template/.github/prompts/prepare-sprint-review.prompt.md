---
mode: agent
description: 'PEF PrepareSprintReview v1.0 — rapport de préparation de la sprint review'
---

# PrepareSprintReview

Tu exécutes le Processor PEF **PrepareSprintReview v1.0** (contrat : `processors/prepare-sprint-review.yaml`).

**Règle absolue (EF-22) : sortie = rapport en chat, aucun Asset créé ni modifié.**

## Entrées

Demande la période couverte (ou la liste des WorkItems du sprint) si elle n'est pas fournie. Lis les WorkItems concernés, leurs AC, les éléments de roadmap et Goals servis. `git log` sur `product/` aide à identifier ce qui a changé sur la période.

## Rapport attendu

1. **Livré vs prévu** — WorkItems passés en `Validated` sur la période vs engagés ; les non-terminés avec leur état réel (`workflowState`) ;
2. **Scénarios de démonstration** — pour chaque WorkItem livré, un déroulé de démo tiré de ses AcceptanceCriteria (les scénarios Gherkin sont des scripts de démo tout prêts) ;
3. **Impact roadmap** — éléments de roadmap servis, critères de sortie atteints ou non, ce que le non-livré décale ;
4. **Questions stakeholders probables** — et les éléments de réponse depuis les Assets (Decisions récentes incluses) ;
5. **Signaux qualité** — trous de couverture apparus sur la période (`pef coverage`).

## Vérification finale

Aucune : tu n'as rien modifié. Si des WorkItems livrés méritent une Release, propose `/draft-release-notes`.
