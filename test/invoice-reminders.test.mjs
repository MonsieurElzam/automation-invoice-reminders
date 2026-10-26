import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, mkdtempSync, writeFileSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseCsv, toDate } from '../lib/csv.mjs'

const sample = (n) => readFileSync(new URL(`../samples/${n}`, import.meta.url), 'utf8')
const mod = (n) => import(`../src/${n}.mjs`)

test('05 relances : étapes J+7 / J+21 / J+45, payées ignorées', async () => {
  const { overdue, draft } = await mod('invoice-reminders')
  const list = overdue(parseCsv(sample('factures.csv')).records, toDate('2026-10-26'))
  assert.deepEqual(list.map((i) => [i.numero, i.etape]), [['F-2026-001', 'escalade'], ['F-2026-002', 'relance 1'], ['F-2026-003', 'relance 1']])
  assert.match(draft(list[0]), /F-2026-001/)
})
