export const convertToCSV = data => {
  const header = Object.keys(data[0]).join(',')
  const rows = data.map(row => Object.values(row).join(','))
  return [header, ...rows].join('\n')
}

export const downloadCSV = (csvData, fileName) => {
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const escapeValue = value => {
  if (
    typeof value === 'string' &&
    (value.includes(',') || value.includes('\n') || value.includes('"'))
  ) {
    return `"${value.replace(/"/g, '""').replace(/\n/g, '')}"`
  }
  return value
}
