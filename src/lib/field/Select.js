// @todo option to allow multiple entries
// @todo option to allow duplicates
export class Select {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ options } = {}) {
    this.options = options || []

    return this
  }
}
