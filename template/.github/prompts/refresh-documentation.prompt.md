---
mode: agent
description: 'PEF RefreshDocumentation v1.0 — rapport d''écarts d''une Documentation (rien n''est modifié)'
---

# RefreshDocumentation

Tu exécutes le Processor PEF **RefreshDocumentation v1.0** (contrat : `processors/refresh-documentation.yaml`).

**Règle absolue (EF-28) : sortie = rapport en chat, aucun Asset modifié.** La mise à jour effective passe par `/enrich-documentation`, sous contrôle humain.

## Entrées

Demande l'ID de la Documentation à examiner. Lis-la, puis : les Assets qu'elle `documents` (compare leur version courante à `coveredVersions`), et les `codeRefs` si le code est ouvert dans le workspace (DEC-006).

## Rapport attendu

1. **Assets modifiés depuis l'approbation** — pour chaque écart de version : ce qui a changé (diff de contenu si accessible via git) et les sections de la Documentation concernées ;
2. **Sections périmées** — passages contredits par l'état actuel des Assets ou du code, cités précisément ;
3. **Règles disparues du code** — codeRefs qui ne pointent plus vers le comportement décrit (fichier déplacé, code supprimé ou réécrit) ;
4. **Sections toujours exactes** — pour délimiter l'effort de rafraîchissement ;
5. **Recommandation** — rafraîchir maintenant (`/enrich-documentation`), ou différer (écarts mineurs), en une phrase.

## Vérification finale

Aucune : tu n'as rien modifié.
