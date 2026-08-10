# Glossaire

Les termes PEF et l'outillage qui les entoure, en langage simple. Les termes en *italique* renvoient à une autre entrée.

## Termes PEF

| Terme | Définition |
|---|---|
| **Product Asset** (ou Asset) | Un fichier markdown qui porte un morceau de connaissance produit : une vision, une exigence, un critère d'acceptation, un cas de test… Chaque Asset a une carte d'identité (son *front matter*) et un contenu libre. |
| **assetType** | La nature d'un Asset : `Vision`, `Goal`, `Roadmap`, `Persona`, `WorkItem`, `Requirement`, `BusinessRule`, `NonFunctionalRequirement`, `Specification`, `AcceptanceCriteria`, `TestPlan`, `TestCase`, `Decision`, `Release`, `Documentation`. |
| **ID** | L'identifiant unique d'un Asset, ex. `SPEC-042`. Le préfixe indique le type. Un ID attribué ne change jamais et n'est jamais réutilisé (DEC-001). |
| **Slug** | La partie lisible du nom de fichier, en minuscules et tirets : dans `SPEC-042-gestion-client.spec.md`, le slug est `gestion-client`. Il peut changer ; l'ID, jamais. |
| **Relation** | Un lien typé entre deux Assets, déclaré dans le *front matter* : `refines`, `satisfies`, `verifies`, `dependsOn`, `supersedes`, `impacts`, `documents`. L'ensemble des relations forme le graphe de traçabilité. |
| **Statut** (`status`) | L'état de validité du **contenu** d'un Asset : `Draft` (brouillon) → `Review` (en relecture) → `Approved` (validé) → `Deprecated` (retiré). Plus `Generated` : produit par une IA et pas encore relu. |
| **workflowState** | Pour les *WorkItems* uniquement : l'état d'avancement du **travail** (`Drafting` → `Todo` → `InProgress` → `Validated`). Indépendant du statut : « ce qui est écrit est-il juste ? » et « où en est le travail ? » sont deux questions différentes. |
| **WorkItem** | Un élément de backlog : `Epic` (grand thème), `UserStory` (besoin utilisateur réalisable en une itération) ou `Bug` (dysfonctionnement qualifié). |
| **Processor** | Une capacité qui lit et/ou produit des Assets : un prompt IA, un script, un humain… Déclaré par un contrat (entrées → sorties). PEF définit le contrat, pas l'implémentation : un Processor est remplaçable. |
| **Activity** | Ce qu'un humain cherche à accomplir (raffiner le backlog, préparer un sprint…). Les Processors y contribuent, ils ne la remplacent pas. |
| **Role** | Un ensemble de responsabilités (Product Owner, QA…), distinct des personnes : une personne peut cumuler plusieurs rôles. |
| **Provenance IA** (bloc `ai:`) | Les métadonnées qui tracent qui a généré un Asset (`processor`, `processorVersion`) et qui l'a relu (`reviewed`, `reviewedBy`, `reviewedAt`). |
| **Couverture** (coverage) | L'analyse des « trous » du graphe : une exigence sans test, un Epic sans UserStory… Ce ne sont pas des erreurs bloquantes, mais des dettes visibles. |
| **Traçabilité** | La capacité à répondre « d'où vient cet Asset, où va-t-il ? » — de la Vision jusqu'au TestCase et retour (`pef trace`). |

## Formats et outillage

| Terme | Définition |
|---|---|
| **Markdown** | Format texte simple (`.md`) lisible par les humains et les machines : `# titre`, `- liste`, `**gras**`. Le format de tous les Assets. |
| **Front matter** | Le bloc YAML entre deux lignes `---` en tête d'un fichier markdown. C'est la carte d'identité structurée de l'Asset — la partie que les outils lisent. |
| **YAML** | Le format `clé: valeur` du front matter. Attention à l'indentation (2 espaces) et aux listes `[A, B]`. |
| **JSON Schema** | Le contrat formel qui définit les clés autorisées du front matter (`schemas/0.1/asset.schema.json`). C'est lui qui fait foi. |
| **Semver** | Versionnement `MAJEUR.MINEUR.PATCH` (ex. `2.1.0`). En PEF (DEC-003) : PATCH = forme, MINEUR = ajout compatible, MAJEUR = le sens change et l'aval doit être revu. |
| **Gherkin** | Format de scénario `Étant donné / Quand / Alors`, recommandé (non obligatoire, DEC-002) pour les critères d'acceptation — et directement rejouable en démo ou en test. |
| **MoSCoW** | Échelle de priorité : `Must` (indispensable), `Should` (important), `Could` (souhaitable), `Wont` (pas cette fois). Champ `priority` des WorkItems (DEC-004). |
| **CLI `pef`** | Le moteur de validation en ligne de commande : `validate`, `coverage`, `trace`, `impact`, `signal`. 100 % local, zéro appel IA. |
| **Prompt file** | Un fichier `.prompt.md` dans `.github/prompts/` : un workflow IA invocable dans le chat Copilot de VS Code en tapant `/nom-du-fichier`. C'est l'implémentation de référence des Processors. |
| **PR (Pull Request)** | La demande de relecture GitHub : vos changements sont proposés, relus, puis fusionnés. C'est le lieu de la revue humaine des Assets générés. |
| **CI** | L'exécution automatique de contrôles à chaque PR (GitHub Actions). En PEF : `validate` + `coverage`, jamais d'appel IA. |
| **Issue** | Une fiche de travail GitHub. `pef signal` en crée une par action humaine requise (relecture en attente, trou de couverture) et la ferme automatiquement quand l'écart disparaît. |
