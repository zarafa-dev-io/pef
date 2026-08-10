# Tutoriel — De la spécification aux tests (lot 1)

Objectif : dérouler la chaîne **Specification → AcceptanceCriteria → TestPlan → TestCases** sur l'exemple livré (mini-CRM « Clientis »), puis la rejouer sur vos propres Assets.

## 0. Se repérer

```bash
cd tools/validate && npm install
npm run pef -- validate          # tout doit être vert
npm run pef -- trace SPEC-001    # la carte de la chaîne exemple
```

`SPEC-001` (création d'une fiche client) vit dans `product/specifications/SPEC-001-creation-client/`, avec ses deux AC dans le même répertoire (EF-5). Le plan de recette `TP-001` et ses trois TestCases sont dans `product/quality/`.

## 1. Écrire (ou relire) la Specification

Une bonne Specification PEF : des **champs** avec leurs contrôles, un **comportement** numéroté observable, des **messages d'erreur exacts** (les tests les reprendront tels quels). Les règles métier citées sont des Assets `BR-` référencés par `dependsOn`, jamais paraphrasées.

```yaml
satisfies: [REQ-001, NFR-001]
dependsOn: [BR-001]
```

## 2. Générer les critères d'acceptation

Dans VS Code, chat Copilot :

```
/generate-acceptance-criteria SPEC-001
```

Le Processor lit la Spec, les BR et NFR liées, et propose des AC en Gherkin français (recommandé, DEC-002) couvrant nominal / limites / erreurs. Chaque AC est créée en `status: Generated` avec son bloc `ai:`, dans le répertoire de la Spec, avec `refines: [SPEC-001]`.

## 3. Générer le plan puis les cas de test

```
/generate-test-plan SPEC-001
/generate-test-cases TP-00x
```

Le TestPlan `verifies` la Spec et porte la matrice AC → TestCases ; chaque TestCase `refines` le plan et `verifies` au moins une AC.

## 4. Contrôler

```bash
npm run pef -- validate
npm run pef -- coverage    # plus de spec-without-ac ni ac-without-testcase
npm run pef -- signal --apply   # une issue review-required par Asset généré
```

## 5. Revoir et approuver

Ouvrez une PR. Relisez chaque Asset généré : corrigez, complétez, ou rejetez. Puis faites-le passer `Generated → Review → Approved` (deux commits — le saut direct est bloqué par PEF008), en complétant le bloc `ai:` :

```yaml
ai:
  generated: true
  processor: GenerateAcceptanceCriteria
  processorVersion: "1.0"
  reviewed: true
  reviewedBy: ROLE-PO
  reviewedAt: "2026-08-10"
```

La CI rejoue `validate` + `coverage` sur la PR ; au merge, `pef signal` ferme les issues de revue.

## 6. Boucler

Toute modification ultérieure de la Spec : `npm run pef -- impact SPEC-001` liste les AC/TP/TC à réexaminer — citez-les dans la PR de modification.
