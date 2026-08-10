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

## Le MVP (lot 1 — Socle)

Le lot 1 livre : le schéma des Assets (`template/schemas/`), le moteur de validation `pef` (`template/tools/validate/` — `validate`, `coverage`, `trace`, `impact`, `signal`), les assets IA GitHub Copilot (`template/.github/`), les contrats de Processors, et un exemple complet déroulant la chaîne Vision → Goal → Epic → UserStory → Specification → AcceptanceCriteria → TestPlan → TestCase.

Commencez par le [guide de démarrage](getting-started.md).
