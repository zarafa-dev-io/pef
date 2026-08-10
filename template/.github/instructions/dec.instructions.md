---
applyTo: "**/*.dec.md"
---

# Rédaction d'une Decision (`.dec.md`)

- `assetType: Decision`, ID `DEC-<nnn>`, dans `product/decisions/`.
- Structure : **Contexte** (le problème et ses contraintes), **Décision** (ce qui est décidé, au présent), **Conséquences** (ce que cela implique, y compris les inconvénients acceptés).
- Une Decision est immuable une fois `Approved` : on ne la modifie pas, on la remplace (`supersedes` depuis la nouvelle).
- Utiliser `impacts` pour lier les Assets concernés quand la décision en modifie le sens.
