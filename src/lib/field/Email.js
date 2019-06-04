// @todo option to allow multiple entries
// @todo option to allow duplicates
// @todo option to allow only whitelisted domains
export class Email {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ outputPlain } = {}) {
    this.outputPlain = !!outputPlain

    return this
  }

  export () {
    return {
      outputPlain: this.outputPlain,
    }
  }
}
