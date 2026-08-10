# Démarrer avec PEF

## Prérequis

- Git, Node.js ≥ 20, VS Code (avec GitHub Copilot pour les Processors IA).

## 1. Instancier le template

Au MVP, l'instanciation se fait par copie (EF-15, `pef init` viendra au lot 5) :

```bash
cp -r template/ mon-projet-pef/
cd mon-projet-pef
git init && git add -A && git commit -m "PEF init"
cd tools/validate && npm install
```

## 2. Valider le dépôt

```bash
cd tools/validate
npm run pef -- validate     # schéma, IDs, références, nommage, statuts
npm run pef -- coverage     # trous de traçabilité
npm run pef -- trace SPEC-001   # chaîne de traçabilité d'un asset
npm run pef -- impact SPEC-001  # assets aval impactés par une modification
```

L'exemple livré (mini-CRM « Clientis ») doit valider sans erreur ni trou de couverture.

## 3. Créer votre premier Asset

1. Copiez un asset d'exemple du bon type (ex. `product/specifications/SPEC-001-.../SPEC-001-creation-client.spec.md`).
2. Prenez le **premier ID libre** du préfixe et nommez le fichier `<ID>-<slug>.<suffixe>.md`.
3. Renseignez le front matter (`status: Draft`) et les relations vers les Assets existants.
4. Relancez `npm run pef -- validate`.

## 4. Utiliser les Processors IA (Copilot)

Dans VS Code, les prompt files sont disponibles via `/` en chat :

- `/generate-acceptance-criteria` — Specification → AcceptanceCriteria ;
- `/generate-test-plan` — Specification + AC → TestPlan ;
- `/generate-test-cases` — TestPlan + AC → TestCases ;
- `/draft-epics` — Roadmap + Requirements → Epics (lot 2) ;
- `/draft-user-stories` — Epic + Specifications → UserStories + AC (lot 2) ;
- `/qualify-bug` — description brute → Bug qualifié + test de non-régression (lot 2) ;
- `/refine-work-item` — WorkItem → rapport de refinement, aucun Asset créé (lot 2).

Toute production IA est créée en `status: Generated` avec son bloc `ai:` de provenance ; **la revue humaine par PR est obligatoire** avant `Approved`.

## 5. Signaler les actions à l'équipe

```bash
npm run pef -- signal           # dry-run : liste les issues à créer/fermer
npm run pef -- signal --apply   # applique via le CLI gh (issues GitHub)
```

La CI (`.github/workflows/pef-validate.yml`) rejoue `validate` + `coverage` sur chaque PR quand l'environnement l'autorise — le poste de travail reste le mode de référence.
