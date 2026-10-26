# automation-invoice-reminders

**Relances de factures** — Repère les impayés et prépare une relance par facture à J+7, J+21 et J+45. Le script n'envoie rien : vous relisez avant d'expédier.

> **EN** — *Invoice reminders.* Finds unpaid invoices and drafts one reminder each at day 7, 21 and 45. It sends nothing — you review before sending.

Node.js 18+, **aucune dépendance**, licence **MIT**. Aucune donnée n'est envoyée nulle part. Les messages affichés sont en français.

## Utilisation

```bash
node src/invoice-reminders.mjs factures.csv --drafts relances/
```

Des fichiers d'exemple sont fournis dans `samples/`.

Aide intégrée (`--help`) :

```text
Usage : node src/invoice-reminders.mjs factures.csv [--today AAAA-MM-JJ] [--drafts dossier]
Colonnes : numero, client, email, montant, echeance, statut (« payé » ignoré).
```

## Tests

```bash
npm test
```

## Limites

- Les exemples de `samples/` sont fictifs ; adaptez les en-têtes de colonnes à vos propres exports.
- Essayez d'abord sur une copie de vos données.
- Fourni tel quel, sans garantie (voir `LICENSE`).

## La série

Ce script fait partie d'une série de **scripts d'automatisation libres** (public : gestion et processus, entre autres) : [présentation, guides et archive complète](https://monsieurelzam.com/scripts) · [tous les dépôts](https://github.com/MonsieurElzam?tab=repositories&q=automation-).

---

Par [Elzam MAMAH](https://monsieurelzam.com) — business analyst, optimisation de processus. Licence MIT.
