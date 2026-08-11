# Sommaire de la documentation

> Page générée par `node docs/build-sommaire.mjs` et régénérée automatiquement à chaque évolution de `docs/` (workflow `docs-sommaire`). **Ne pas l'éditer à la main.**

## Prise en main

### [PEF — Product Engineering Framework](README.md)

Les méthodes changent. Les outils changent. Les IA changent. Les Product Assets restent.

[Les cinq concepts](README.md#les-cinq-concepts) · [État du MVP](README.md#état-du-mvp) · [Par où commencer](README.md#par-où-commencer) · [Lire cette documentation confortablement](README.md#lire-cette-documentation-confortablement)

### [Démarrer pas à pas](getting-started.md)

Ce guide s'adresse à un Product Owner (ou QA, BA…) qui n'a jamais utilisé PEF. À la fin, vous aurez un dépôt PEF fonctionnel, vous saurez lire et créer un Asset, le valider, et lancer votre première génération IA.

[1. Ce que vous installez, en deux phrases](getting-started.md#1-ce-que-vous-installez-en-deux-phrases) · [2. Prérequis](getting-started.md#2-prérequis) · [3. Instancier le template](getting-started.md#3-instancier-le-template) · [4. Installer et lancer le moteur de validation](getting-started.md#4-installer-et-lancer-le-moteur-de-validation) · [5. Lire un Asset : l'anatomie](getting-started.md#5-lire-un-asset-lanatomie) · [6. Créer votre premier Asset à la main](getting-started.md#6-créer-votre-premier-asset-à-la-main) · [7. Votre première génération IA](getting-started.md#7-votre-première-génération-ia) · [8. Partager l'état avec l'équipe](getting-started.md#8-partager-létat-avec-léquipe) · [9. Consulter cette documentation en local](getting-started.md#9-consulter-cette-documentation-en-local) · [10. Dépannage](getting-started.md#10-dépannage) · [Et ensuite ?](getting-started.md#et-ensuite-)

### [Glossaire](glossaire.md)

Les termes PEF et l'outillage qui les entoure, en langage simple. Les termes en italique renvoient à une autre entrée.

[Termes PEF](glossaire.md#termes-pef) · [Formats et outillage](glossaire.md#formats-et-outillage)

## Comprendre

### [Les concepts PEF](concepts.md)

Résumé opérationnel du manifeste, qui reste la référence complète.

[PEF en une minute](concepts.md#pef-en-une-minute) · [Les cinq concepts](concepts.md#les-cinq-concepts) · [Activity ≠ Processor : la distinction fondamentale](concepts.md#activity-≠-processor-la-distinction-fondamentale) · [Anatomie d'un Asset](concepts.md#anatomie-dun-asset) · [Le graphe d'Assets](concepts.md#le-graphe-dassets) · [Human in the Loop : le circuit de confiance](concepts.md#human-in-the-loop-le-circuit-de-confiance) · [Pourquoi Git ?](concepts.md#pourquoi-git-) · [Les principes directeurs](concepts.md#les-principes-directeurs) · [Ce que PEF n'est pas](concepts.md#ce-que-pef-nest-pas)

## Tutoriels

### [Tutoriel — De la spécification aux tests (lot 1)](tutorials/lot-1-chaine-de-test.md)

Objectif : dérouler la chaîne Specification → AcceptanceCriteria → TestPlan → TestCases sur l'exemple livré (mini-CRM « Clientis »), puis la rejouer sur vos propres Assets.

[0. Se repérer](tutorials/lot-1-chaine-de-test.md#0-se-repérer) · [1. Écrire (ou relire) la Specification](tutorials/lot-1-chaine-de-test.md#1-écrire-ou-relire-la-specification) · [2. Générer les critères d'acceptation](tutorials/lot-1-chaine-de-test.md#2-générer-les-critères-dacceptation) · [3. Générer le plan puis les cas de test](tutorials/lot-1-chaine-de-test.md#3-générer-le-plan-puis-les-cas-de-test) · [4. Contrôler](tutorials/lot-1-chaine-de-test.md#4-contrôler) · [5. Revoir et approuver](tutorials/lot-1-chaine-de-test.md#5-revoir-et-approuver) · [6. Boucler](tutorials/lot-1-chaine-de-test.md#6-boucler)

### [Tutoriel — Constituer et vivre le backlog (lot 2)](tutorials/lot-2-backlog.md)

Objectif : construire le backlog (Epics, UserStories, Bugs), le raffiner, et suivre la réalisation des WorkItems sans quitter le repo.

[1. Les deux axes d'un WorkItem](tutorials/lot-2-backlog.md#1-les-deux-axes-dun-workitem) · [2. Des Epics depuis la roadmap](tutorials/lot-2-backlog.md#2-des-epics-depuis-la-roadmap) · [3. Des UserStories depuis un Epic](tutorials/lot-2-backlog.md#3-des-userstories-depuis-un-epic) · [4. Qualifier un bug](tutorials/lot-2-backlog.md#4-qualifier-un-bug) · [5. Raffiner avant d'engager](tutorials/lot-2-backlog.md#5-raffiner-avant-dengager) · [6. Suivre la réalisation](tutorials/lot-2-backlog.md#6-suivre-la-réalisation) · [7. Signaler à l'équipe](tutorials/lot-2-backlog.md#7-signaler-à-léquipe)

### [Tutoriel — L'amont et les cérémonies (lot 3)](tutorials/lot-3-amont-et-ceremonies.md)

Objectif : construire la chaîne amont Vision → Goals → Roadmap avec assistance IA, décrire les utilisateurs, préparer les cérémonies et livrer une Release — sans que l'IA ne décide jamais à votre place.

[1. De vos notes à la Vision](tutorials/lot-3-amont-et-ceremonies.md#1-de-vos-notes-à-la-vision) · [2. Décrire les utilisateurs](tutorials/lot-3-amont-et-ceremonies.md#2-décrire-les-utilisateurs) · [3. La roadmap, un élément à la fois](tutorials/lot-3-amont-et-ceremonies.md#3-la-roadmap-un-élément-à-la-fois) · [4. Préparer le sprint planning](tutorials/lot-3-amont-et-ceremonies.md#4-préparer-le-sprint-planning) · [5. Préparer la sprint review](tutorials/lot-3-amont-et-ceremonies.md#5-préparer-la-sprint-review) · [6. Livrer](tutorials/lot-3-amont-et-ceremonies.md#6-livrer) · [7. Vérifier la boucle complète](tutorials/lot-3-amont-et-ceremonies.md#7-vérifier-la-boucle-complète)

### [Tutoriel — La documentation vivante (lot 4)](tutorials/lot-4-documentation.md)

Objectif : couvrir votre produit par une documentation qui sait quand elle est périmée, reconstruire la connaissance depuis un code existant (moderne ou legacy), et embarquer les nouveaux arrivants — le tout sous…

[1. Le problème que résout ce lot](tutorials/lot-4-documentation.md#1-le-problème-que-résout-ce-lot) · [2. Voir la péremption en action](tutorials/lot-4-documentation.md#2-voir-la-péremption-en-action) · [3. Le déclencheur documentaire (EF-31) : détecter en CI, exécuter au poste](tutorials/lot-4-documentation.md#3-le-déclencheur-documentaire-ef-31-détecter-en-ci-exécuter-au-poste) · [4. Rétro-documenter un code existant](tutorials/lot-4-documentation.md#4-rétro-documenter-un-code-existant) · [5. Le parcours d'onboarding](tutorials/lot-4-documentation.md#5-le-parcours-donboarding) · [6. Ce que la couverture surveille désormais](tutorials/lot-4-documentation.md#6-ce-que-la-couverture-surveille-désormais)

## Référence

### [Référence du modèle PEF 0.1](reference.md)

La description complète du contrat des Assets. La source de vérité formelle est le JSON Schema : schemas/0.1/asset.schema.json — cette page l'explique en français.

[Le front matter, champ par champ](reference.md#le-front-matter-champ-par-champ) · [AssetTypes, préfixes et suffixes](reference.md#assettypes-préfixes-et-suffixes) · [Les relations : quand utiliser laquelle ?](reference.md#les-relations-quand-utiliser-laquelle-) · [Les statuts : le cycle de vie du contenu](reference.md#les-statuts-le-cycle-de-vie-du-contenu) · [Le versioning sémantique (DEC-003)](reference.md#le-versioning-sémantique-dec-003) · [Cycle de vie des WorkItems : deux axes indépendants](reference.md#cycle-de-vie-des-workitems-deux-axes-indépendants) · [La provenance IA (bloc ai:)](reference.md#la-provenance-ia-bloc-ai) · [La péremption documentaire (lot 4)](reference.md#la-péremption-documentaire-lot-4) · [Contrôles : où chercher le détail](reference.md#contrôles-où-chercher-le-détail)

### [Le moteur de validation pef](validation.md)

Le moteur est un petit outil en ligne de commande, embarqué dans chaque repo PEF (tools/validate/). Il est 100 % local et déterministe : aucun appel IA, aucun réseau — les mêmes fichiers en entrée donnent toujours le…

[Préparer et lancer](validation.md#préparer-et-lancer) · [Lire un rapport](validation.md#lire-un-rapport) · [validate — les 11 règles bloquantes](validation.md#validate-—-les-11-règles-bloquantes) · [coverage — les 13 trous de traçabilité](validation.md#coverage-—-les-13-trous-de-traçabilité) · [trace — d'où ça vient, où ça va](validation.md#trace-—-doù-ça-vient-où-ça-va) · [impact — qu'est-ce que je casse si je change ceci ?](validation.md#impact-—-quest-ce-que-je-casse-si-je-change-ceci-) · [signal — transformer les rapports en travail d'équipe](validation.md#signal-—-transformer-les-rapports-en-travail-déquipe) · [La CI : un renfort, pas une dépendance](validation.md#la-ci-un-renfort-pas-une-dépendance) · [Performances](validation.md#performances)

### [Les Processors](processors.md)

Un Processor est une capacité d'analyse, de création ou de transformation de Product Assets. Ça peut être un prompt IA, un script, un service — ou un humain. PEF définit le contrat (ce qui entre, ce qui sort), jamais…

[Pour les novices : comment ça se présente concrètement ?](processors.md#pour-les-novices-comment-ça-se-présente-concrètement-) · [Le contrat (EF-16)](processors.md#le-contrat-ef-16) · [Les 21 Processors livrés](processors.md#les-21-processors-livrés) · [Le circuit complet d'une génération](processors.md#le-circuit-complet-dune-génération) · [Les invariants que tout Processor respecte](processors.md#les-invariants-que-tout-processor-respecte) · [Écrire votre propre Processor](processors.md#écrire-votre-propre-processor) · [Remplacer un Processor (la promesse AI-agnostic)](processors.md#remplacer-un-processor-la-promesse-ai-agnostic)

## Documents fondateurs

### [Gestion d'un client](manifeste-pef.md)

...

### [PRD — PEF MVP (PEF-PO)](prd-pef-mvp.md)

Dérivé du manifeste d'architecture PEF v0.3 (08/2026). Le manifeste porte la vision et les concepts ; ce PRD porte les exigences du MVP : le profil PEF-PO complet, couvrant l'ensemble des tâches d'un Product Owner, de…

[1. Problème et opportunité](prd-pef-mvp.md#1-problème-et-opportunité) · [2. Objectifs et indicateurs de succès](prd-pef-mvp.md#2-objectifs-et-indicateurs-de-succès) · [3. Personas d'adoption](prd-pef-mvp.md#3-personas-dadoption) · [4. Périmètre](prd-pef-mvp.md#4-périmètre) · [5. Exigences fonctionnelles](prd-pef-mvp.md#5-exigences-fonctionnelles) · [6. Exigences non fonctionnelles](prd-pef-mvp.md#6-exigences-non-fonctionnelles) · [7. Contraintes et dépendances](prd-pef-mvp.md#7-contraintes-et-dépendances) · [8. Organisation du projet](prd-pef-mvp.md#8-organisation-du-projet) · [9. Risques](prd-pef-mvp.md#9-risques) · [10. Critères de succès du MVP](prd-pef-mvp.md#10-critères-de-succès-du-mvp) · [11. Questions ouvertes](prd-pef-mvp.md#11-questions-ouvertes)
