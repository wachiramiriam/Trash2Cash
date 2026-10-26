// Spreadsheet apps can run cells that start with these characters as formulas.
// Names and other user-supplied text end up in exports, so neutralise them.
const FORMULA_START = /^[=+\-@\t\r]/

function cell(value) {
  let s = value == null ? '' : String(value)
  if (typeof value === 'string' && FORMULA_START.test(s)) s = `'${s}`
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const toLines = (headers, rows) => [headers, ...rows].map((row) => row.map(cell).join(','))

function save(name, lines) {
  const date = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD, local time
  const text = lines.join('\r\n')

  // The BOM makes Excel read the file as UTF-8, so non-English characters survive
  const blob = new Blob(['\uFEFF' + text], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${name}-${date}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function downloadCsv(name, headers, rows) {
  save(name, toLines(headers, rows))
}

// sections: [{ title, headers, rows }, ...]. Each gets a title row and a blank line between.
export function downloadCsvSections(name, sections) {
  const lines = []
  sections.forEach((section, i) => {
    if (i > 0) lines.push('')
    lines.push(cell(section.title))
    lines.push(...toLines(section.headers, section.rows))
  })
  save(name, lines)
}