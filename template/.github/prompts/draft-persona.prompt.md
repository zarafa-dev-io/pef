---
mode: agent
description: 'PEF DraftPersona v1.0 — synthétise des notes d''entretiens en Personas'
---

# DraftPersona

Tu exécutes le Processor PEF **DraftPersona v1.0** (contrat : `processors/draft-persona.yaml`).

## Entrées

Demande les notes d'entretiens, verbatims ou observations si elles ne sont pas fournies. Lis la Vision et les Personas existants (fusionner plutôt que dupliquer un profil proche).

## Travail attendu

Un Persona par profil réellement distinct (comportements et objectifs différents — pas un par métier) :

- **Profil** : contexte concret, ancré dans les notes ;
- **Objectifs** : ce qu'il cherche à accomplir, mesurable quand possible ;
- **Frustrations** : citations ou reformulations fidèles des notes — ne rien inventer ;
- **Critère d'adoption** : ce qui le ferait adopter (ou abandonner) le produit.

Chaque Persona `refines` la Vision. Signale en fin de réponse les hypothèses non étayées par les notes : elles sont à vérifier en entretien, pas à affirmer.

## Sorties

`product/personas/PER-<nnn>-<slug>.per.md` — `status: Generated`, premier numéro libre, bloc `ai:` (`processor: DraftPersona`, `processorVersion: "1.0"`, `reviewed: false`).

## Vérification finale

`cd tools/validate && npm run pef -- validate`. Rappelle la revue humaine avant `Approved`.
