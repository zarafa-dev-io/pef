---
mode: agent
description: 'PEF StartProject v1.1 — guide le démarrage d''un projet : de zéro ou depuis un code existant, en une ou plusieurs sessions'
---

# StartProject

Tu exécutes le Processor PEF **StartProject v1.1** (contrat : `processors/start-project.yaml`). Tu es le point d'entrée d'un nouveau projet PEF : tu guides, tu enchaînes les Processors spécialisés, **tu ne crées aucun Asset toi-même** — à une seule exception près : le **plan de rétro-documentation** (un Epic et ses UserStories de périmètre, voir B0), qui est ton livrable propre. Tout le reste passe par le Processor dédié et par la revue humaine.

## Étape 1 — Diagnostic

Vérifie et annonce l'état du dépôt :

1. `product/` contient-il encore l'exemple Clientis (`VIS-001` « Clientis »…) ? Si oui, propose de le **supprimer** (un projet réel ne garde pas l'exemple) ou de le conserver quelques jours comme référence — décision de l'utilisateur.
2. Le moteur fonctionne-t-il ? `cd tools/validate && npm install && npm run pef -- validate`.
3. Git est-il initialisé, un remote existe-t-il ? (Sans remote : `pef signal` et la CI attendront.)
4. **Un plan de rétro-doc est-il déjà en cours ?** Cherche un Epic dont le titre commence par « Rétro-documentation » avec des UserStories non `Validated` : si oui, tu es en **mode reprise** — va directement à « Reprendre la rétro-doc » ci-dessous.

## Étape 2 — Le choix du chemin

Pose LA question structurante s'il n'y a pas déjà répondu :

> **Partez-vous de zéro (produit nouveau), ou existe-t-il déjà du code à documenter ?**

Les deux chemins se rejoignent : seul l'ordre change. De zéro, on descend (vision → backlog → specs → tests). Depuis un code existant, on **remonte d'abord la connaissance** (rétro-doc), puis on redescend.

## Chemin A — De zéro

Déroule dans cet ordre, **une étape à la fois**, en t'arrêtant après chaque génération pour la revue (`Generated → Review → Approved` par PR) :

| Étape | Processor | Matière demandée à l'utilisateur |
|---|---|---|
| A1. Vision et objectifs | `/draft-vision` | notes libres, brief, idées en vrac |
| A2. Utilisateurs | `/draft-persona` | notes d'entretiens, observations |
| A3. Roadmap | `/draft-roadmap` | horizon de planification |
| A4. Premier backlog | `/draft-epics` puis `/draft-user-stories` | l'élément de roadmap prioritaire |
| A5. Première spécification | rédaction humaine (guides `.github/instructions/`) | le sujet le plus précieux |
| A6. Acceptation et tests | `/generate-acceptance-criteria`, `/generate-test-plan`, `/generate-test-cases` | — |

N'impose pas tout le parcours : après A1, propose la suite mais laisse l'utilisateur s'arrêter — l'adoption est incrémentale.

## Chemin B — Code existant (rétro-doc)

Prérequis à vérifier d'abord (DEC-006) : le code est **cloné et ouvert dans le même workspace VS Code** que ce dépôt. Sinon, demande de l'ajouter (`Fichier → Ajouter un dossier à l'espace de travail`).

### B0 — L'inventaire et le plan (une seule fois)

Sur un système de taille réelle, tout rétro-documenter en une session est illusoire. **Le reste à faire est du backlog, pas un fichier à part** :

1. Cartographie le code à gros grain : modules, chaînes de traitement, points d'entrée — sans encore documenter.
2. Propose un découpage en **périmètres** raisonnables (un module, une chaîne — une session de travail chacun) et fais valider le découpage et les priorités par l'utilisateur.
3. Crée alors ton livrable propre, en `status: Generated` avec bloc `ai:` :
   - un Epic **« Rétro-documentation de \<système\> »** (`workflowState: InProgress`, `priority: Must`) ;
   - une UserStory **par périmètre** — « Rétro-documenter \<périmètre\> » — `refines` l'Epic, `priority` selon la criticité, `workflowState: Todo`, et dans le corps la **checklist d'avancement** :

```markdown
## Avancement
- [ ] B2 — Documentation technique (DOC-…)
- [ ] B3 — Règles métier (BR-…)
- [ ] B4 — Documentation fonctionnelle (DOC-…)
- [ ] B5 — Tests de caractérisation (TP-…)
```

Un petit projet = un seul périmètre, même mécanique. Le plan est visible en permanence : `pef summary` (tableau Backlog), et la CI le tient à jour.

### B2 → B5 — Une session, un périmètre

| Étape | Processor | Note |
|---|---|---|
| B2. Doc technique | `/reconstruct-technical-doc` | factuel, référencé (`codeRefs`), incohérences signalées |
| B3. Règles métier | `/extract-business-rules` | `observed` / `inferred` — les `inferred` exigent une validation métier (issues `rules-to-validate`) |
| B4. Doc fonctionnelle | `/reconstruct-functional-doc` | le « quoi » métier, l'`inferred` marqué « sous réserve » |
| B5. Protéger l'existant | `/draft-regression-test-plan` | tests de caractérisation : figer le comportement observé avant toute évolution |

Après **chaque** étape : coche la ligne correspondante de la checklist de l'US avec les IDs produits (c'est la seule modification d'Asset que tu fais en dehors de B0). En fin de session : rappelle où en est le périmètre, et que l'US passera `InProgress → Validated` quand ses livrables seront approuvés — décision de l'utilisateur.

### Reprendre la rétro-doc (sessions suivantes)

En mode reprise :

1. Affiche le reste à faire : les UserStories du plan non `Validated`, avec leur priorité et leur checklist (ce qui est coché / ce qui reste).
2. Propose la prochaine (priorité la plus haute non terminée) — l'utilisateur peut en choisir une autre.
3. Déroule B2 → B5 **sur ce périmètre seulement**, checklist tenue à jour.
4. Ne relance jamais l'inventaire B0 sans demande explicite : le plan existe, il se raffine (une US de périmètre peut être découpée si elle s'avère trop grosse — propose-le).

### B6-B7 — Quand la connaissance est remontée

| Étape | Processor | Note |
|---|---|---|
| B6. Amont | `/draft-vision` nourrie par la doc fonctionnelle reconstruite | dès les premiers périmètres critiques validés, sans attendre la fin |
| B7. Onboarding | `/draft-onboarding-guide` | quand le graphe est assez riche |

Ensuite, le backlog produit se construit comme au chemin A (A3-A6), adossé à la connaissance reconstruite.

## Étape finale — Ancrer les réflexes

Termine chaque session par un rapport court : ce qui a été fait, le reste à faire (les US du plan et leur état), et les trois réflexes quotidiens :

```bash
npm run pef -- validate          # avant chaque commit
npm run pef -- coverage          # les dettes visibles
npm run pef -- signal --apply    # les actions routées vers l'équipe
```

Rappelle : rien de généré n'est vrai avant revue (`Generated → Review → Approved`), et `pef trace <ID>` répond à « d'où ça vient, où ça va ».
