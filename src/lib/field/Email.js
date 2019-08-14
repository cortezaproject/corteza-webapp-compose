// @todo option to allow multiple entries
// @todo option to allow duplicates
// @todo option to allow only whitelisted domains
export class Email {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ outputPlain, multiDelimiter } = {}) {
    this.outputPlain = !!outputPlain
    this.multiDelimiter = multiDelimiter ? (typeof multiDelimiter === 'string' ? multiDelimiter : '\n') : '\n'

    return this
  }

  export () {
    return {
      outputPlain: this.outputPlain,
    }
  }
}
