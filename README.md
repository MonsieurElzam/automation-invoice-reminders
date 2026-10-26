# automation-invoice-reminders

**Invoice reminders.** Finds unpaid invoices and drafts one reminder each at day 7, 21 and 45. It sends nothing — you review before sending.

Node.js 18+, **no dependencies**, **MIT** licence. No data is sent anywhere. The scripts print their messages in French.

## Usage

```bash
node src/invoice-reminders.mjs factures.csv --drafts relances/
```

Sample files are provided in `samples/`.

Run it with `--help` for the built-in options (the scripts print in French).

## Tests

```bash
npm test
```

## Limits

- The files in `samples/` are fictional: adapt the column headers to your own exports.
- Try it on a copy of your data first.
- Provided as is, without warranty (see `LICENSE`).

## The series

This script is part of a series of **free automation scripts** (audience: business and process, among others): [overview, guides and full archive](https://monsieurelzam.com/en/scripts) · [all repositories](https://github.com/MonsieurElzam?tab=repositories&q=automation-).

---

By [Elzam MAMAH](https://monsieurelzam.com/en), business analyst and process-optimization expert. MIT licence.
