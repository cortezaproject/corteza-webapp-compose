// @todo option to allow multiple entries
// @todo option to allow duplicates
export class Select {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ options, selectType } = {}) {
    this.options = options || []
    this.selectType = selectType ? (typeof selectType === 'string' ? selectType : 'default') : 'default'

    return this
  }

  export () {
    return {
      options: this.options,
      selectType: this.selectType,
    }
  }
}
