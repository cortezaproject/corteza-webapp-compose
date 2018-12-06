export class Number {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ format, prefix, suffix, precision } = {}) {
    this.format = format || ''
    this.prefix = prefix || ''
    this.suffix = suffix || ''

    return this
  }
}
