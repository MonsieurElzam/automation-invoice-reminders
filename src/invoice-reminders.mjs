#!/usr/bin/env node
/* Repère les factures impayées et prépare les relances (J+7, J+21, escalade J+45).
   N'envoie rien : produit une liste et, au choix, un brouillon de message par facture. */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { parseCsv, toNumber, toDate } from '../lib/csv.mjs'
import { isMain, parseArgs, usage, fail } from '../lib/cli.mjs'

const DAY = 86_400_000
export const STAGES = [
  { min: 45, label: 'escalade', ton: 'ferme' },
  { min: 21, label: 'relance 2', ton: 'insistant' },
  { min: 7, label: 'relance 1', ton: 'courtois' },
]
const PAID = new Set(['paye', 'payee', 'payé', 'payée', 'paid', 'solde', 'soldé'])

/** Colonnes attendues : numero, client, email, montant, echeance, statut (facultatif). */
export function overdue(records, today) {
  const out = []
  for (const r of records) {
    if (PAID.has(String(r.statut ?? '').trim().toLowerCase())) continue
    const due = toDate(r.echeance)
    if (!due) continue
    const days = Math.floor((today - due) / DAY)
    const stage = STAGES.find((s) => days >= s.min)
    if (stage) out.push({ ...r, jours: days, etape: stage.label, ton: stage.ton, montantNum: toNumber(r.montant) })
  }
  return out.sort((a, b) => b.jours - a.jours)
}

export function draft(inv) {
  const intro = {
    courtois: `Sauf erreur de notre part, la facture ${inv.numero} n'a pas encore été réglée.`,
    insistant: `Nous revenons vers vous au sujet de la facture ${inv.numero}, toujours impayée malgré notre précédent message.`,
    ferme: `La facture ${inv.numero} accuse maintenant ${inv.jours} jours de retard.`,
  }[inv.ton]
  return `À : ${inv.email}\nObjet : Facture ${inv.numero} — ${inv.etape}\n\nBonjour ${inv.client},\n\n${intro}\nMontant : ${inv.montant} — échéance : ${inv.echeance}.\n\nMerci de nous indiquer la date de règlement prévue.\n\nCordialement\n`
}

if (isMain(import.meta.url)) {
  const args = parseArgs(process.argv.slice(2), ['help'])
  usage(`
Usage : node src/invoice-reminders.mjs factures.csv [--today AAAA-MM-JJ] [--drafts dossier]
Colonnes : numero, client, email, montant, echeance, statut (« payé » ignoré).`, args, 1)
  const today = args.today ? toDate(args.today) : toDate(new Date().toISOString())
  if (!today) fail('--today doit être au format AAAA-MM-JJ.')
  const list = overdue(parseCsv(readFileSync(args._[0], 'utf8')).records, today)
  if (!list.length) console.log('Aucune facture à relancer.')
  else {
    console.table(list.map((i) => ({ facture: i.numero, client: i.client, montant: i.montant, retard: `${i.jours} j`, action: i.etape })))
    const total = list.reduce((s, i) => s + (Number.isNaN(i.montantNum) ? 0 : i.montantNum), 0)
    console.log(`Encours à relancer : ${total.toLocaleString('fr-FR')}`)
  }
  if (args.drafts && list.length) {
    mkdirSync(args.drafts, { recursive: true })
    for (const i of list) writeFileSync(join(args.drafts, `${String(i.numero).replace(/[^\w.-]/g, '_')}.txt`), draft(i))
    console.log(`${list.length} brouillon(s) écrit(s) dans ${args.drafts}`)
  }
}
