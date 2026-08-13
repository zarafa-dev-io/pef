# PEF — Product Engineering Framework

> Les méthodes changent. Les outils changent. Les IA changent. **Les Product Assets restent.**

PEF range toute la connaissance d'un produit — vision, objectifs, backlog, règles métier, spécifications, tests, documentation — dans un dépôt Git, sous forme de fichiers markdown structurés, **validés automatiquement, tracés de bout en bout, et exploitables par les humains comme par les IA**. L'IA propose, l'humain approuve : le circuit de revue est outillé, jamais contourné.

📖 **[Documentation complète](https://zarafa-dev-io.github.io/pef/)** · 🧭 **[Exemple vivant : le projet PEF géré avec PEF](https://zarafa-dev-io.github.io/pef-product/viewer/)**

## Deux façons de démarrer un projet

Dans un dépôt instancié depuis le template, le Processor **`/start-project`** (chat Copilot) diagnostique le dépôt puis vous guide :

### De zéro (produit nouveau)

La chaîne descend : notes libres → Vision et Goals mesurables → Personas → Roadmap (un Asset par élément) → Epics et UserStories → Spécifications → Critères d'acceptation → Plan et cas de test. Chaque génération IA naît en `Generated` et passe par votre revue.

### Depuis un code existant : la rétro-documentation

Le cas le plus fréquent — et le plus précieux. PEF **remonte la connaissance enfouie dans le code**, puis redescend normalement :

1. **Inventaire** (`/start-project`, une seule fois) : le code est cartographié et découpé en **domaines fonctionnels** (« Facturation », pas « module billing-svc »). Le plan de rétro-doc vit **en backlog** : un Epic par domaine, une UserStory « Rétro-documenter … » avec sa checklist — le reste à faire est visible dans le sommaire, tenu par la CI, et la démarche se mène **en autant de sessions que nécessaire**.
2. **Par domaine, quatre Processors** :
   - `/reconstruct-technical-doc` — composants, points d'entrée, flux, dépendances, chaque affirmation référencée dans le code (`codeRefs`) ;
   - `/extract-business-rules` — une BusinessRule par règle trouvée, avec son niveau de certitude : **`observed`** (lue telle quelle) ou **`inferred`** (déduite — la validation métier est exigée avant approbation, et signalée par issue) ;
   - `/reconstruct-functional-doc` — le « quoi » métier depuis le « comment » technique ;
   - `/draft-regression-test-plan` — des **tests de caractérisation** qui figent le comportement observé avant toute évolution ; un comportement suspect est figé tel quel et signalé comme bug candidat, jamais « corrigé » en douce.
3. **Convergence** : la production se rattache aux Epics de domaine — à la fin, un projet legacy rétro-documenté a exactement la même structure qu'un projet né de zéro, avec la même vue par domaine, la même traçabilité, la même détection de péremption (`stale-doc`) et le même enrichissement continu (un WorkItem validé dont la doc est en retard déclenche une issue ; l'humain exécute et approuve).

Le flux est **agnostique au langage** : il se déroule à l'identique sur du TypeScript ou une chaîne COBOL/JCL. Prérequis unique : le code ouvert dans le même workspace VS Code (multi-root).

## Ce que contient ce monorepo

| Répertoire | Contenu |
|---|---|
| [`template/`](template/) | Le dépôt modèle instanciable : schémas, moteur de validation, 21 Processors Copilot, CI, explorateur, exemple complet |
| [`docs/`](docs/) | La documentation utilisateur ([site public](https://zarafa-dev-io.github.io/pef/)) : démarrage, concepts, tutoriels, référence |
| [`cli/`](cli/) | Le futur CLI Go (lot 5, différé — le moteur Node/TS du template fait référence) |

## Démarrage rapide

```bash
# Instancier (seul template/ est nécessaire — clone sparse)
git clone --depth 1 --filter=blob:none --sparse https://github.com/zarafa-dev-io/pef.git pef-tmp
git -C pef-tmp sparse-checkout set template
cp -r pef-tmp/template/. mon-projet-pef/ && rm -rf pef-tmp

# Valider
cd mon-projet-pef/tools/validate && npm install
npm run pef -- validate      # 28 assets d'exemple, 0 erreur
npm run pef -- summary       # le sommaire : carte Mermaid + vue par domaine

# Explorer (navigation cliquable)
cd ../.. && npx serve .      # puis http://localhost:3000/viewer/
```

Guide pas à pas : [Démarrer](https://zarafa-dev-io.github.io/pef/#/getting-started) · Mise à jour d'un projet existant sans toucher aux Assets : `node tools/update-framework.mjs`.

## État

Lots 1 à 4 livrés (socle, backlog, amont et cérémonies, documentation vivante) — 8 Decisions structurantes approuvées — pilote en cours. Détail : [le sommaire du projet PEF, généré par PEF](https://github.com/zarafa-dev-io/pef-product/tree/main/product).
