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
| 3 — Amont et cérémonies | Vision, Goals, Roadmap, Personas, Releases ; sprint planning/review | À venir |
| 4 — Documentation | Asset `Documentation`, rétro-documentation, enrichissement déclenché | À venir |
| 5 — CLI Go | Portage à iso-contrat, binaire unique | Différé |

## Par où commencer

1. [Démarrer](getting-started.md) — instancier le template et valider son premier Asset ;
2. [Concepts](concepts.md) — les cinq concepts et les principes ;
3. [Tutoriel lot 1](tutorials/lot-1-chaine-de-test.md) — de la spécification aux tests ;
4. [Tutoriel lot 2](tutorials/lot-2-backlog.md) — constituer et vivre le backlog ;
5. [Référence](reference.md), [Validation](validation.md), [Processors](processors.md) — les pages de consultation.
