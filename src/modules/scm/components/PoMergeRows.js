// PO screens (Polocal / Poimport / Poservice): on NEW-flow POs, lines with the same Part Number
// and the same unit rate are shown as ONE row with summed Qty / Total Value.
//
// Display only - po_dtl still keeps one line per indent (GRN, MI, QC, debit notes and the budget
// ledger all depend on that). A merged row's editable fields (HSN, GST, delivery date, ...) are
// bound to its first line's form fields; on save every line reads them back via repIdOf().
//
// On/off: backend sends mainEntity.mergeSamePartRows ('1'/'0') from PoDAO.getMergeSamePartRowsFlag -
// only NEW-flow POs from tenant property PO_MERGE_SAME_PART_FROM_PO_ID onwards; older POs never change.
// Deactivating that property turns it off for the screens AND the PO PDF (_merged templates) at once.
const SUM_FIELDS = ['qty', 'totalValue', 'totalValueFx']

const toNum = value => {
  const n = parseFloat(value)
  return Number.isNaN(n) ? null : n
}

const buildMergedPoRows = (lines, enabled, rateFields) => {
  const list = lines || []
  const rows = []
  const repOf = {}
  const rawIndex = {}
  const byKey = new Map()

  list.forEach((line, i) => {
    rawIndex[line.poDtlId] = i
    const productCode = line.indentDtlList?.[0]?.productCode
    const key = [productCode, ...rateFields.map(f => toNum(line[f]) ?? line[f])].join('|')
    const group = enabled && productCode ? byKey.get(key) : undefined

    if (!group) {
      const row = enabled ? { ...line, siblingIds: [line.poDtlId] } : line
      if (enabled && productCode) byKey.set(key, row)
      rows.push(row)
      repOf[line.poDtlId] = line.poDtlId
      return
    }

    group.siblingIds.push(line.poDtlId)
    SUM_FIELDS.forEach(f => {
      const a = toNum(group[f])
      const b = toNum(line[f])
      if (a !== null || b !== null) group[f] = String(Math.round(((a || 0) + (b || 0)) * 1000) / 1000)
    })
    repOf[line.poDtlId] = group.poDtlId
  })

  return {
    rows,
    // poDtlId of the displayed row whose form fields this line saves from
    repIdOf: id => repOf[id] ?? id,
    // position in the raw line list - revision highlighting compares against prevpoTable by index
    rawIndexOf: record => rawIndex[record.poDtlId],
  }
}

export default buildMergedPoRows
