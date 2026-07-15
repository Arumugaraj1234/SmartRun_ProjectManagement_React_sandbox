/* eslint-disable no-unused-vars */
const numberToWords = require('number-to-words')

const convertNumberToWords = number => {
  if (typeof number === 'undefined' || Number.isNaN(number)) {
    return ''
  }

  // Round to 2 decimal places
  number = Number(number).toFixed(2)

  // Split into rupees and paise
  const [rupeesStr, paiseStr] = number.split('.')
  let rupees = parseInt(rupeesStr, 10)
  const paise = parseInt(paiseStr, 10)

  if (rupees > 10000000000) {
    return undefined
  }

  const ones = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine']
  const teens = [
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ]
  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ]

  const convertLessThanOneThousand = num => {
    let result = ''
    if (num >= 100) {
      result += `${ones[Math.floor(num / 100)]} Hundred `
      num %= 100
    }
    if (num >= 20) {
      result += `${tens[Math.floor(num / 10)]} `
      num %= 10
    }
    if (num >= 10) {
      result += `${teens[num - 10]} `
      return result
    }
    if (num > 0) {
      result += `${ones[num]} `
    }
    return result
  }

  let words = ''
  const crore = Math.floor(rupees / 10000000)
  rupees %= 10000000
  const lakh = Math.floor(rupees / 100000)
  rupees %= 100000
  const thousand = Math.floor(rupees / 1000)
  const rest = rupees % 1000

  if (crore > 0) {
    words += `${convertLessThanOneThousand(crore)}Crore `
  }
  if (lakh > 0) {
    words += `${convertLessThanOneThousand(lakh)}Lakh `
  }
  if (thousand > 0) {
    words += `${convertLessThanOneThousand(thousand)}Thousand `
  }
  if (rest > 0) {
    words += convertLessThanOneThousand(rest)
  }

  words = words.trim()
  words = words.charAt(0).toUpperCase() + words.slice(1)

  let finalWords = words ? `${words} Rupees` : ''

  // Handle paise
  if (paise > 0) {
    const paiseWords = convertLessThanOneThousand(paise).trim()
    finalWords += ` and ${paiseWords} Paise`
  }

  return finalWords ? ` ${finalWords} Only` : ''
}

// module.exports = convertNumberToWords;
export default convertNumberToWords
