// @todo option to allow multiple entries
// @todo option to allow duplicates
export class Select {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ options, selectType, multiDelimiter } = {}) {
    this.options = this.prepOptions(options || [])
    this.selectType = selectType ? (typeof selectType === 'string' ? selectType : 'default') : 'default'
    this.multiDelimiter = multiDelimiter ? (typeof multiDelimiter === 'string' ? multiDelimiter : '\n') : '\n'

    return this
  }

  export () {
    return {
      options: this.options,
      selectType: this.selectType,
    }
  }

  /**
   * Helper to prepare options for the given select
   * @param {Array} options Array of available options
   * @returns {Array}
   */
  prepOptions (options) {
    return options.map(opt => {
      if (typeof (opt) !== 'object') {
        opt = { value: opt, text: opt }
      }

      opt.text = opt.text || opt.value
      return opt
    })
  }
}
