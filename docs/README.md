# PEF — Product Engineering Framework

> Les méthodes changent. Les outils changent. Les IA changent. **Les Product Assets restent.**

PEF est un framework de Product Engineering augmenté par l'IA : la connaissance produit vit dans des **Product Assets** markdown structurés, versionnés dans Git, validés automatiquement, et exploitables aussi bien par les humains que par les IA.

## Les cinq concepts

| Concept | Rôle |
|---|---|
| **Product Assets** | La connaissance persistante (vision, specs, tests…), en markdown + front matter YAML |
| **Roles** | Les responsabilités (PO, QA…), distinctes des personnes |
| **Activities** | Ce que l'humain cherche à accomplir (refinement, sprint planning…) |
| **Processors** | Ce qu'un humain, un outil ou une IA peut faire sur les Assets |
| **Relationships** | Le graphe de traçabilité entre Assets |

## État du MVP

| Lot | Contenu | État |
|---|---|---|
| 1 — Socle | Schémas, moteur `pef` (validate/coverage/trace/impact/signal), assets Copilot, CI, exemple complet | ✅ Livré |
| 2 — Backlog | WorkItems (Epic/US/Bug), `workflowState`, priorité MoSCoW, Processors backlog et refinement | ✅ Livré |
| 3 — Amont et cérémonies | Vision, Goals, Roadmap par élément, Personas, Releases ; sprint planning/review | ✅ Livré |
| 4 — Documentation | Asset `Documentation`, rétro-documentation, enrichissement déclenché | À venir |
| 5 — CLI Go | Portage à iso-contrat, binaire unique | Différé |

## Par où commencer

1. [Démarrer pas à pas](getting-started.md) — de zéro jusqu'à votre première génération IA, sans prérequis ;
2. [Les concepts](concepts.md) — comprendre PEF en une lecture ; le [glossaire](glossaire.md) est là pour tout terme obscur ;
3. Les tutoriels, dans l'ordre : [de la spec aux tests](tutorials/lot-1-chaine-de-test.md), [le backlog](tutorials/lot-2-backlog.md), [l'amont et les cérémonies](tutorials/lot-3-amont-et-ceremonies.md) ;
4. En consultation au fil de l'eau : [le modèle d'Assets](reference.md), [le moteur de validation](validation.md), [les Processors](processors.md).

## Lire cette documentation confortablement

```bash
npx serve docs     # depuis la racine du monorepo, puis http://localhost:3000
```

Le site s'affiche alors avec son menu de navigation à gauche et la recherche. (Ouvrir `index.html` en double-cliquant ne fonctionne pas : le navigateur bloque le chargement en `file://` — il faut servir le dossier en HTTP.)
