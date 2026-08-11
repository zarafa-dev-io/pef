# Démarrer pas à pas

Ce guide s'adresse à un Product Owner (ou QA, BA…) qui n'a jamais utilisé PEF. À la fin, vous aurez un dépôt PEF fonctionnel, vous saurez lire et créer un Asset, le valider, et lancer votre première génération IA.

> Un mot vous échappe ? Tout est défini dans le [glossaire](glossaire.md).

## 1. Ce que vous installez, en deux phrases

PEF n'est pas une application : c'est un **dépôt Git structuré** (des fichiers markdown + un petit outil de validation) que vous manipulez depuis VS Code. L'IA (GitHub Copilot) y est un assistant qui lit et propose des fichiers — jamais un décideur.

## 2. Prérequis

| Outil | Pourquoi | Vérifier l'installation |
|---|---|---|
| [Git](https://git-scm.com/) | L'historique et la revue | `git --version` |
| [Node.js ≥ 20](https://nodejs.org/) | Fait tourner le moteur de validation | `node --version` |
| [VS Code](https://code.visualstudio.com/) | Votre espace de travail | — |
| GitHub Copilot (extension VS Code) | Exécute les Processors IA | icône Copilot dans la barre d'état |
| [CLI `gh`](https://cli.github.com/) *(optionnel)* | `pef signal` → issues GitHub | `gh auth status` |

Ouvrez un terminal (dans VS Code : menu *Terminal → New Terminal*) et lancez les commandes de vérification : chacune doit répondre par un numéro de version, pas par une erreur.

> **Le chemin le plus court** : une fois le template instancié (étapes 3-4), lancez `/start-project` dans le chat Copilot — il diagnostique votre dépôt puis vous guide pas à pas, que vous partiez **de zéro** ou **d'un code existant** à rétro-documenter. Les étapes 5 à 8 ci-dessous détaillent ce qu'il orchestre.

## 3. Instancier le template

Au MVP, on instancie **par copie** (la commande `pef init` viendra plus tard). Seul le répertoire `template/` du monorepo est nécessaire : il est autonome (schémas, moteur de validation, prompts Copilot, CI, exemple).

**Cas 1 — vous avez déjà le monorepo `pef` en local :**

```bash
cp -r template/ mon-projet-pef/
```

**Cas 2 — vous partez d'un poste vierge** (il faut un compte GitHub ayant accès à `zarafa-dev-io/pef`) : un clone « sparse » ne télécharge que `template/` :

```bash
git clone --depth 1 --filter=blob:none --sparse https://github.com/zarafa-dev-io/pef.git pef-tmp
git -C pef-tmp sparse-checkout set template
cp -r pef-tmp/template/. mon-projet-pef/     # le "/." inclut le répertoire caché .github
rm -rf pef-tmp
```

> Sous Windows (PowerShell), remplacez la copie par `robocopy pef-tmp\template mon-projet-pef /E` (copie aussi `.github`), et la suppression par `Remove-Item -Recurse -Force pef-tmp`.

Puis, dans les deux cas :

```bash
cd mon-projet-pef
git init
git add -A
git commit -m "Initialisation PEF (template pefVersion 0.1)"
```

Pour un dépôt distant avec CI et signalements (recommandé) :

```bash
gh repo create <org>/mon-projet-pef --private --source . --remote origin --push
for l in pef review-required coverage-gap broken-ref stale-doc doc-enrichment rules-to-validate; do
  gh label create "$l" --color 1D76DB --description "PEF signal (EF-33)"
done
```

**Si votre produit a déjà du code** (rétro-documentation) : le code reste dans son propre dépôt, relié par un workspace VS Code multi-root (DEC-006). Créez un fichier `mon-produit.code-workspace` à côté des deux dépôts :

```json
{
  "folders": [
    { "path": "mon-projet-pef" },
    { "path": "mon-code-existant" }
  ]
}
```

et ouvrez ce fichier dans VS Code (*Fichier → Ouvrir l'espace de travail à partir d'un fichier*).

Ce que vous venez de copier :

```
mon-projet-pef/
├── product/           ← VOS Assets vivront ici (un exemple complet est fourni)
│   ├── vision/  goals/  roadmap/  personas/
│   ├── backlog/                   ← Epics, UserStories, Bugs
│   ├── requirements/              ← exigences, règles métier, NFR
│   ├── specifications/            ← une spec = un répertoire (ses AC dedans)
│   ├── quality/                   ← plans et cas de test
│   ├── decisions/  releases/
├── schemas/           ← le contrat du front matter (ne pas modifier à la main)
├── tools/validate/    ← le moteur de validation (Node.js)
├── processors/        ← les contrats des Processors IA
└── .github/           ← instructions et prompts Copilot, CI
```

## 4. Installer et lancer le moteur de validation

```bash
cd tools/validate
npm install
npm run pef -- validate
```

Sortie attendue (l'exemple fourni est valide) :

```
25 asset(s) checked, 0 error(s).
```

> **Le `--` est obligatoire** : `npm run pef -- validate` (les arguments après `--` vont au moteur). Si vous l'oubliez, la commande est ignorée silencieusement.

Puis regardez les « trous » de traçabilité (il n'y en a pas dans l'exemple) :

```bash
npm run pef -- coverage
# 25 asset(s) analysed, 0 gap(s).
```

## 5. Lire un Asset : l'anatomie

Ouvrez `product/specifications/SPEC-001-creation-client/SPEC-001-creation-client.spec.md` :

```yaml
---
pefVersion: "0.1"          # version du modèle PEF (toujours "0.1" pour l'instant)
assetType: Specification   # la nature de l'Asset
id: SPEC-001               # identifiant unique, ne changera JAMAIS
title: Spécification — création d'une fiche client
status: Approved           # validité du contenu : Draft → Review → Approved
version: 1.0.0             # semver : majeur = le sens change
satisfies: [REQ-001, NFR-001]   # relations : cette spec répond à ces exigences
dependsOn: [BR-001]             # ...et applique cette règle métier
---
# En dessous du second ---, c'est du markdown libre : le contenu pour les humains.
```

La partie entre les `---` est le **front matter** : la carte d'identité lue par les outils. Le nom du fichier suit toujours `<ID>-<slug>.<suffixe>.md` — le suffixe (`.spec.md`, `.us.md`…) permet aux instructions IA de cibler un type d'Asset où qu'il soit rangé.

Explorez la chaîne de cet Asset :

```bash
npm run pef -- trace SPEC-001
```

Vous verrez d'où il vient (en remontant : exigence ← user story ← epic ← roadmap ← goal ← vision) et ce qui s'appuie sur lui (ses critères d'acceptation, son plan de test, ses cas de test). **C'est toute la promesse de PEF en une commande.**

## 6. Créer votre premier Asset à la main

Créons une exigence. Copiez le modèle le plus proche :

```bash
cp product/requirements/REQ-001-creation-client.req.md \
   product/requirements/REQ-002-recherche-client.req.md
```

Éditez le nouveau fichier :

```yaml
---
pefVersion: "0.1"
assetType: Requirement
id: REQ-002                       # premier numéro REQ- libre
title: Recherche d'un client par nom ou email
status: Draft                     # tout nouveau contenu commence en Draft
version: 1.0.0
refines: [US-001]                 # ne référencez QUE des IDs existants
---

# Recherche d'un client par nom ou email

Le système doit permettre de retrouver un client par une recherche
partielle sur le nom ou l'email, en moins d'une seconde.
```

Validez :

```bash
npm run pef -- validate
```

Si vous avez fait une erreur, le rapport vous dit **où et quoi** :

| Message | Cause probable | Correction |
|---|---|---|
| `PEF005 duplicate id` | vous avez oublié de changer l'`id` après la copie | prenez le premier numéro libre |
| `PEF004 file name ... does not follow` | nom de fichier ≠ `REQ-002-<slug>.req.md` | renommez le fichier |
| `PEF006 unresolved reference` | une relation pointe vers un ID inexistant | corrigez ou créez la cible |
| `PEF002 /status must be equal to...` | statut hors liste (faute de frappe) | `Draft`, `Review`, `Approved`, `Deprecated`, `Generated` |
| `PEF001 missing YAML front matter` | les `---` d'ouverture/fermeture manquent | vérifiez les deux lignes `---` |

Puis committez : `git add -A && git commit -m "REQ-002 : recherche client"`.

## 7. Votre première génération IA

1. Dans VS Code, ouvrez le chat Copilot (icône chat, ou `Ctrl+Alt+I`).
2. Tapez `/` : la liste des prompts du dépôt apparaît (ils viennent de `.github/prompts/` — la liste complète des 20 Processors est dans [la page Processors](processors.md)).
3. Choisissez `/generate-acceptance-criteria` et indiquez `SPEC-001`.
4. Le Processor lit la spec, ses règles métier et NFR **directement dans le repo**, puis propose des fichiers AC.

Ce qui sort de l'IA arrive toujours en `status: Generated` avec sa provenance :

```yaml
status: Generated
ai:
  generated: true
  processor: GenerateAcceptanceCriteria
  processorVersion: "1.0"
  reviewed: false
```

**Rien n'est vrai tant que vous ne l'avez pas relu** : ouvrez une PR, corrigez ou rejetez, puis faites passer l'Asset `Generated → Review → Approved` (le saut direct est bloqué par la validation — c'est voulu). En approuvant, complétez la provenance (`reviewed: true`, `reviewedBy`, `reviewedAt`).

## 8. Partager l'état avec l'équipe

```bash
npm run pef -- signal            # dry-run : liste ce qui serait signalé
npm run pef -- signal --apply    # crée/ferme les issues GitHub (via gh)
```

Chaque action humaine requise (un Asset à relire, un trou de couverture) devient une issue, **fermée automatiquement** quand l'écart disparaît. La CI (`.github/workflows/pef-validate.yml`) rejoue la validation sur chaque PR.

## 9. Consulter cette documentation en local

```bash
npx serve docs        # depuis la racine du monorepo, puis http://localhost:3000
```

> Ouvrir `index.html` directement depuis l'explorateur de fichiers (`file://`) ne fonctionne pas — le navigateur bloque le chargement des pages : il faut servir le dossier en HTTP (la commande ci-dessus suffit).

## 10. Dépannage

- **`npm run pef` ne fait rien** → il manque le `--` avant la commande.
- **`node` introuvable** → Node.js n'est pas installé ou pas dans le PATH ; réinstallez depuis nodejs.org et rouvrez le terminal.
- **Accents cassés (`Ã©`)** → le fichier a été réenregistré dans le mauvais encodage ; dans VS Code : barre d'état → encodage → *Save with encoding* → UTF-8.
- **Mon prompt `/…` n'apparaît pas dans le chat** → vérifiez que vous avez ouvert le **dossier du projet** (pas un fichier isolé) et que l'extension Copilot est à jour.
- **`pef signal --apply` échoue** → `gh auth login` d'abord, et le dépôt doit avoir un remote GitHub.

## Et ensuite ?

Suivez les tutoriels dans l'ordre : [de la spec aux tests](tutorials/lot-1-chaine-de-test.md), [le backlog](tutorials/lot-2-backlog.md), [l'amont et les cérémonies](tutorials/lot-3-amont-et-ceremonies.md).
