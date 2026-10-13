// PJS grouping screens (Create Indent Group, Details popup, PO Justification Sheet): lines are
// merged into one row only when Part Number, Description AND Specification are exactly the same.
// Generic part codes (e.g. "Cable Tie" for 100mm / 400mm) must stay separate rows so each gets
// its own price.
const samePartKey = (partNo, description, specification) =>
  [partNo, description, specification].map(value => (value == null ? '' : String(value))).join('\u0001')

export default samePartKey
