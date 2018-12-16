import numeral from 'numeral'

export class Number {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ format, prefix, suffix, precision } = {}) {
    this.format = format || ''
    this.prefix = prefix || ''
    this.suffix = suffix || ''
    this.precision = precision || '0'

    return this
  }
}

export function formatNumber (format, precision, value) {
  if (format && format.length > 0) {
    return numeral(parseFloat(value).toFixed(parseInt(precision))).format(format)
  }
  return parseFloat(value).toFixed(parseInt(precision))
}

export function formatNumberFull (format, prefix, suffix, precision, value) {
  return prefix + formatNumber(format, precision, value) + suffix
}
