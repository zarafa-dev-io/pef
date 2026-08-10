# Tutoriel — L'amont et les cérémonies (lot 3)

Objectif : construire la chaîne amont **Vision → Goals → Roadmap** avec assistance IA, décrire les utilisateurs, préparer les cérémonies et livrer une Release — sans que l'IA ne décide jamais à votre place.

## 1. De vos notes à la Vision

Rassemblez votre matière brute (brief, atelier, idées en vrac), puis :

```
/draft-vision
> [collez vos notes]
```

Le Processor propose une Vision (problème, cible, proposition de valeur, **non-objectifs**) et 2 à 5 Goals **mesurables** qui la `refines` — le tout en `Generated`. Ce qui n'est ni vision ni objectif (features, contraintes) est listé à part comme matière à backlog, sans créer d'Assets.

L'amont est la matière la plus subjective : relisez de près, reformulez — la formulation finale vous appartient. Puis `Generated → Review → Approved` par PR.

## 2. Décrire les utilisateurs

```
/draft-persona
> [notes d'entretiens, verbatims]
```

Un Persona par profil **réellement distinct**, fidèle aux notes (les hypothèses non étayées sont signalées, pas affirmées). Voir `PER-001` (Camille, gérant de TPE) dans l'exemple.

## 3. La roadmap, un élément à la fois

```
/draft-roadmap
```

Convention DEC-005 : **un Asset `RM-` par élément** (thème × horizon), avec un critère de sortie observable, chaque élément `satisfies` son Goal. La vue d'ensemble, c'est le répertoire :

```bash
ls product/roadmap/
# RM-001-socle-referentiel.rm.md      T1 — satisfies GOAL-001
# RM-002-fiabilite-donnees.rm.md      T2 — satisfies GOAL-001
# RM-003-exploitation.rm.md           T3 — satisfies GOAL-001
```

La couverture surveille les deux bouts de la chaîne :

- `roadmap-without-goal` — un élément qui ne sert aucun objectif : pourquoi le faire ?
- `goal-without-workitem` — un Goal jamais servi : vœu pieux à transformer en Epics (`/draft-epics`).

## 4. Préparer le sprint planning

```
/prepare-sprint-planning
```

Rapport (jamais d'Asset, EF-22) : candidats prêts triés par priorité MoSCoW, WorkItems demandés mais non `Approved` (et qui doit agir), dépendances, risques, proposition d'agenda. Le Sprint Goal et la sélection restent vos décisions en séance — et la capacité/vélocité reste dans votre outil d'exécution.

## 5. Préparer la sprint review

```
/prepare-sprint-review
> sprint du 01/08 au 10/08
```

Livré vs prévu (sur la foi des `workflowState`), **scénarios de démo tirés des AC** (un scénario Gherkin est un script de démo tout prêt), impact roadmap (critères de sortie atteints ?), questions stakeholders probables avec éléments de réponse.

## 6. Livrer

```
/draft-release-notes
> US-001, BUG-001
```

Une Release en **langage métier** : bénéfices d'abord, contenu ensuite, vérification enfin (les tests exécutés). Seuls les WorkItems `Validated` entrent ; la Release les `dependsOn`. Voir `REL-001` dans l'exemple. Revue et approbation comme toujours.

## 7. Vérifier la boucle complète

```bash
npm run pef -- trace GOAL-001
```

Vous devez lire la chaîne entière : Vision ← Goal ← élément de roadmap ← Epic ← UserStory ← … ← TestCase ← Release. C'est la promesse PEF : chaque test remonte à la vision, chaque objectif descend jusqu'à une preuve.
