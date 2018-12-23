import numeral from 'numeral'

export class Number {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ format, prefix, suffix, precision } = {}) {
    this.format = format || this.format || 0
    this.prefix = prefix || this.prefix || ''
    this.suffix = suffix || this.suffix || ''
    this.precision = this.precision || 0

    switch (typeof precision) {
      case 'string':
        this.precision = parseInt(precision)
        break
      case 'number':
        this.precision = precision
        break
    }

    return this
  }

  formatValue (value) {
    switch (typeof value) {
      case 'string':
        value = parseFloat(value)
        break
      case 'number':
        break
      default:
        value = 0
    }

    const p = this.precision < 0 || this.precision > 6 ? 0 : this.precision
    const f = value.toFixed(p)

    let out = f

    if (this.format && this.format.length > 0) {
      out = numeral(f).format(this.format)
    }

    return this.prefix + out + this.suffix
  }
}
