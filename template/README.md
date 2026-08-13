# Template de projet PEF

Dépôt modèle d'un projet PEF, instanciable **par copie** au MVP (`pef init` au lot 5). Épinglé sur `pefVersion: "0.1"`.

## Structure

```
template/
├── schemas/0.1/          # JSON Schema du front matter — source de vérité du contrat
├── tools/validate/       # moteur pef (Node/TypeScript) : validate, coverage, trace, impact, signal
├── processors/           # contrats YAML des Processors (EF-16)
├── .github/
│   ├── copilot-instructions.md      # instructions globales Copilot
│   ├── instructions/                # instructions ciblées par assetType (applyTo sur les suffixes)
│   ├── prompts/                     # prompt files des Processors (/generate-…)
│   └── workflows/pef-validate.yml   # CI : validate + coverage sur chaque PR
├── viewer/               # explorateur local du produit : carte cliquable, IDs navigables (npx serve . → /viewer/)
└── product/              # les Product Assets, avec un exemple complet (mini-CRM « Clientis »)
```

## Commandes

```bash
cd tools/validate && npm install
npm run pef -- validate [--since <ref-git>]   # erreurs bloquantes, exit 1
npm run pef -- coverage [--strict]            # trous de traçabilité
npm run pef -- trace <ID>                     # chaîne amont/aval d'un asset
npm run pef -- impact <ID>                    # assets aval impactés (tests signalés)
npm run pef -- signal [--apply]               # sync des écarts vers des issues GitHub (gh)
npm run pef -- summary                        # régénère product/README.md, le sommaire des Assets
```

L'exemple `product/` déroule la chaîne complète Vision → Goal → Epic → UserStory → Requirement/BusinessRule/NFR → Specification → AcceptanceCriteria → TestPlan → TestCase, plus deux Decisions. Remplacez-le par vos propres Assets en conservant les conventions (voir `docs/reference.md` du monorepo).
