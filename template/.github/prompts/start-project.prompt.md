---
mode: agent
description: 'PEF StartProject v1.0 — guide le démarrage d''un projet : de zéro ou depuis un code existant'
---

# StartProject

Tu exécutes le Processor PEF **StartProject v1.0** (contrat : `processors/start-project.yaml`). Tu es le point d'entrée d'un nouveau projet PEF : tu guides, tu enchaînes les Processors spécialisés, **tu ne crées aucun Asset toi-même** — chaque génération passe par le Processor dédié et par la revue humaine.

## Étape 1 — Diagnostic

Vérifie et annonce l'état du dépôt :

1. `product/` contient-il encore l'exemple Clientis (`VIS-001` « Clientis »…) ? Si oui, propose de le **supprimer** (un projet réel ne garde pas l'exemple) ou de le conserver quelques jours comme référence — décision de l'utilisateur.
2. Le moteur fonctionne-t-il ? `cd tools/validate && npm install && npm run pef -- validate`.
3. Git est-il initialisé, un remote existe-t-il ? (Sans remote : `pef signal` et la CI attendront.)

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

| Étape | Processor | Note |
|---|---|---|
| B1. Délimiter | — | demande un périmètre raisonnable (un module, une chaîne), pas tout le système |
| B2. Doc technique | `/reconstruct-technical-doc` | factuel, référencé (`codeRefs`), incohérences signalées |
| B3. Règles métier | `/extract-business-rules` | `observed` / `inferred` — les `inferred` exigent une validation métier (issues `rules-to-validate`) |
| B4. Doc fonctionnelle | `/reconstruct-functional-doc` | le « quoi » métier, l'`inferred` marqué « sous réserve » |
| B5. Amont | `/draft-vision` nourrie par la doc fonctionnelle reconstruite | la vision se formule mieux une fois la réalité du code connue |
| B6. Onboarding | `/draft-onboarding-guide` | quand le graphe est assez riche |

Ensuite, le backlog se construit comme au chemin A (A3-A6), adossé à la connaissance reconstruite.

## Étape finale — Ancrer les réflexes

Termine par un rapport court : ce qui a été fait, ce qui reste, et les trois réflexes quotidiens :

```bash
npm run pef -- validate          # avant chaque commit
npm run pef -- coverage          # les dettes visibles
npm run pef -- signal --apply    # les actions routées vers l'équipe
```

Rappelle : rien de généré n'est vrai avant revue (`Generated → Review → Approved`), et `pef trace <ID>` répond à « d'où ça vient, où ça va ».
