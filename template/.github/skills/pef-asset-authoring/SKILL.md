---
name: pef-asset-authoring
description: Création et modification de Product Assets PEF (fichiers .md de product/) — à charger avant de rédiger tout Asset, humainement demandé ou généré par un Processor. Garantit le respect des templates du projet, du schéma et du circuit de revue.
---

# Rédiger un Product Asset PEF

## La règle centrale : partir du template du projet

Pour **tout** nouvel Asset, la structure de départ est `templates/<suffixe>.template.md` (ex. `templates/spec.template.md` pour une Specification, `templates/us.template.md` pour une UserStory). Ces templates appartiennent **au projet** — l'organisation les a peut-être personnalisés : sections ajoutées, tournures imposées, champs commentés. C'est leur forme qui fait foi, pas celle que tu connais par défaut.

1. Lis le template correspondant au suffixe cible.
2. Remplace les placeholders (`XXX`, `<…>`) — ID au premier numéro libre du préfixe, jamais réutilisé.
3. Conserve **toutes** les sections du template (une section sans objet se remplit de « Sans objet » plutôt que d'être supprimée) ; les commentaires `<!-- … -->` sont des consignes à suivre puis à retirer.
4. Complète les relations avec des IDs **existants** uniquement.

## Les invariants (rappel)

- Nom de fichier `<ID>-<slug>.<suffixe>.md` (EF-35), slug en minuscules `a-z0-9-` ;
- production par Processor : `status: Generated` + bloc `ai:` complet (`processor`, `processorVersion`, `reviewed: false`) ;
- jamais de passage direct à `Approved` : la revue humaine passe par `Review` (PEF008) ;
- ne jamais supprimer un Asset (déprécier) ; ne jamais modifier un Asset `Approved` sans repasser son statut en revue ;
- après toute création/modification : `cd tools/validate && npm run pef -- validate`.

## Si le template manque

Un suffixe sans template dans `templates/` : utilise la structure de l'exemple le plus proche dans `product/`, et signale l'absence — c'est un trou à combler dans le projet.
