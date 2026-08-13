# Tutoriel — La documentation vivante (lot 4)

Objectif : couvrir votre produit par une documentation qui **sait quand elle est périmée**, reconstruire la connaissance depuis un code existant (moderne ou legacy), et embarquer les nouveaux arrivants — le tout sous contrôle humain.

## 1. Le problème que résout ce lot

Toute documentation classique ment un jour : le produit évolue, pas elle. PEF attaque le problème par la traçabilité : une Documentation **déclare ce qu'elle couvre** (`documents`) et **fige les versions couvertes à l'approbation** (`coveredVersions`). Dès qu'un Asset couvert évolue, l'outillage le voit.

```yaml
---
assetType: Documentation
docType: Functional          # Functional | Technical | Onboarding
id: DOC-001
status: Approved
documents: [SPEC-001, BR-001]
coveredVersions:             # obligatoire en Approved (PEF012)
  SPEC-001: "1.0.0"          # ← la version couverte au moment de l'approbation
  BR-001: "1.0.0"
---
```

## 2. Voir la péremption en action

Modifiez `SPEC-001` (changez un message d'erreur, passez sa version à `2.0.0` — bump majeur, le sens change), puis :

```bash
npm run pef -- coverage
```

```
[stale-doc]
  documentation/DOC-001-...  Documentation DOC-001 was approved against SPEC-001 v1.0.0, now v2.0.0 — refresh needed
```

Pour savoir précisément quoi rafraîchir : `/refresh-documentation DOC-001` — un **rapport** (rien n'est modifié) : Assets modifiés, sections périmées, sections toujours exactes, recommandation.

## 3. Le déclencheur documentaire (EF-31) : détecter en CI, exécuter au poste

La chaîne complète, 100 % conforme à la contrainte « pas d'IA en CI » :

```
1. Une US passe workflowState: Validated          (le travail est fait)
2. Sa chaîne est couverte par DOC-001, périmée    (stale-doc)
3. pef signal (local OU job CI) ouvre l'issue     [PEF] doc-enrichment: US-001
4. VOUS lancez /enrich-documentation sur votre poste
5. Le Processor réécrit les sections touchées, met à jour coveredVersions,
   repasse la doc en Generated
6. Revue par PR, approbation, merge
7. Le signal suivant ferme l'issue automatiquement
```

L'automatisation **signale et propose** ; l'humain **exécute et approuve**. Jamais de merge automatique.

## 4. Rétro-documenter un code existant

Prérequis (DEC-006) : ouvrez un **workspace VS Code multi-root** contenant votre repo PEF et le repo de code — c'est tout, Copilot lit le code directement.

Déroulez les trois Processors dans l'ordre :

```
/reconstruct-technical-doc     → DOC (Technical) : composants, points d'entrée,
                                 flux, dépendances — chaque affirmation avec ses
                                 codeRefs (clientis-app/src/clients/rules.ts:18-42)

/extract-business-rules        → une BR par règle trouvée, avec son niveau de certitude :
                                 observed = lue telle quelle dans le code
                                 inferred = déduite → VALIDATION MÉTIER REQUISE

/reconstruct-functional-doc    → DOC (Functional) : le "quoi" métier depuis le
                                 "comment" technique + les règles
```

Puis **protégez l'existant avant d'y toucher** :

```
/draft-regression-test-plan    → TestPlan + TestCases de caractérisation :
                                 chaque règle et chaque flux observé est figé
                                 par un test rejouable. Un comportement suspect
                                 est figé TEL QUEL et signalé comme candidat
                                 /qualify-bug — jamais corrigé en douce.
```

Le TestPlan `verifies` la documentation fonctionnelle, chaque TestCase `verifies` la règle qu'il fige ; les tests issus de règles `inferred` sont marqués « à confirmer » et tombent si la validation métier infirme la règle.

Le niveau `observed`/`inferred` est le garde-fou central de la rétro-doc : une règle **déduite** peut être fausse (ou documenter un bug !). Chaque `inferred` non validée génère une issue `rules-to-validate`, et les docs la citent « sous réserve de validation métier ». Le code qui contredit un Asset existant est **signalé, jamais lissé**.

Ce flux est agnostique au langage : il se déroule à l'identique sur du TypeScript ou sur une chaîne COBOL/JCL — c'est l'objet du contre-pilote mainframe prévu en fin de MVP.

**Sur un gros système, la rétro-doc se mène en plusieurs sessions** : `/start-project` commence par un inventaire et découpe le code en **périmètres = domaines fonctionnels**, puis crée le plan **en backlog** — un Epic par domaine (nom métier : « Facturation ») et sous chacun une UserStory « Rétro-documenter … » portant sa checklist d'avancement (B2 doc technique → B5 tests). Le « reste à faire » n'est pas un fichier à part : c'est `pef summary`, tenu à jour par la CI. À chaque session, `/start-project` détecte le plan et propose de reprendre au domaine suivant.

Et la production se **rattache au domaine** (DEC-008) : les règles extraites `refines` l'Epic, les documentations le `documents` — la vue par domaine du sommaire se remplit au fil de la rétro-doc, exactement comme sur un projet né de zéro. Un Asset qui apparaît « Hors domaine » est un rattachement oublié.

## 5. Le parcours d'onboarding

```
/draft-onboarding-guide
```

Produit une Documentation `Onboarding` : un parcours de lecture **ordonné et commenté** (pourquoi lire cet Asset, qu'en retenir), décliné par profil métier et technique, terminé par les premiers gestes concrets. Voir `DOC-002` dans l'exemple. À regénérer quand le graphe s'enrichit — sa péremption est détectée comme les autres (`coveredVersions`).

## 6. Ce que la couverture surveille désormais

```bash
npm run pef -- coverage
```

- `spec-approved-without-doc` — une spec approuvée que la documentation ignore ;
- `doc-without-documents` — une documentation qui ne couvre rien ;
- `stale-doc` — une documentation en retard sur ses Assets.

Et `pef signal` route tout ça vers l'équipe : `rules-to-validate` pour les règles inférées, `doc-enrichment` pour les enrichissements en attente.
