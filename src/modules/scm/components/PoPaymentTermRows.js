// PO screens (Polocal / Poimport / Poservice): Payment Terms table rows.
//
// Users raise several PRAs per payment term (even on a single 100% term), so each live PRA on a
// term gets its own row (S.No / Term / Percentage repeated, Term Value = that PRA's amount
// payable incl. GST, Pending Value = what was left on the term after that PRA, Action = its
// PRA No / Date / Status). While the term still has a pending amount, one more row follows with the PRA button
// and the term's own pending value.
//
// PRA list per term comes from the backend as term.praList (PoDAO.getPraListByPoId - live PRAs only).
import React from 'react'
import moment from 'moment'

// terms: the table's payment terms; showPraButton(term): the screen's own "PRA button" rule.
// Every row keeps its term's original index as termIndex - handleDetail() relies on it to tell
// the final payment term apart.
const buildPaymentTermRows = (terms, showPraButton) =>
  (terms || []).flatMap((term, termIndex) => {
    const praList = term.praList || []
    // Running balance: term value less every PRA raised so far on this term (in PRA order)
    let remaining = parseFloat(term.paymentAmount) || 0
    const rows = praList.map(pra => {
      remaining -= parseFloat(pra.praValue) || 0
      return {
        ...term,
        rowKey: `${term.potId}-pra-${pra.praId}`,
        termIndex,
        hasPra: true,
        pra,
        praPendingAfter: remaining,
      }
    })
    // No PRA yet, or money still pending: the term's own row (PRA button / existing display)
    if (praList.length === 0 || showPraButton(term)) {
      rows.push({
        ...term,
        rowKey: `${term.potId}-term`,
        termIndex,
        hasPra: praList.length > 0,
      })
    }
    return rows
  })

// Term Value cell: a PRA row shows that PRA's value; the PRA-button row of a term that already has
// PRAs shows 0 (Pending Value shows what is left); a term without PRAs shows its term value.
export const renderTermValue = record => {
  if (record.pra) return <span>{Math.round(parseFloat(record.pra.praValue) || 0)}</span>
  if (record.hasPra) return <span>0</span>
  return <span>{Math.round(parseFloat(record.paymentAmount) || 0)}</span>
}

export const PraDetailBlock = ({ pra }) => (
  <div>
    <span style={{ whiteSpace: 'nowrap' }}>
      PRA No : <b>{pra.praCode}</b>
    </span>
    <br />
    <span style={{ whiteSpace: 'nowrap' }}>
      PRA Date : <b>{pra.praDate ? moment(pra.praDate).format('DD-MMM-YYYY') : '-'}</b>
    </span>
    <br />
    <span style={{ whiteSpace: 'nowrap' }}>
      PRA Status: <b>{pra.statusDesc || '-'}</b>
    </span>
  </div>
)

export default buildPaymentTermRows
