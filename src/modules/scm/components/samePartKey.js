// PJS grouping screens (Create Indent Group, Details popup, PO Justification Sheet): lines are
// merged into one row only when Part Number, Description AND Specification are the same.
// Spaces, tabs and line breaks are ignored when comparing (case still has to match).
// Generic part codes (e.g. "Cable Tie" for 100mm / 400mm) must stay separate rows so each gets
// its own price.
const samePartKey = (partNo, description, specification) =>
  [partNo, description, specification].map(value => (value == null ? '' : String(value).replace(/\s+/g, ''))).join('\u0001')

export default samePartKey
