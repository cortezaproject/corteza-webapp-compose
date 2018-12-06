import * as kinds from './loader'

export default class Field {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ name, label, helpText, defaultValue, maxLength, isRequired, isPrivate, kind, options } = {}) {
    this.name = typeof name === 'string' ? name : this.name || ''
    this.label = typeof label === 'string' ? label : this.label || ''
    this.helpText = typeof helpText === 'string' ? helpText : this.helpText || ''
    this.defaultValue = defaultValue !== undefined ? defaultValue : this.defaultValue || undefined
    this.maxLength = typeof maxLength === 'number' ? maxLength : this.maxLength || 0
    this.isRequired = typeof gdpr === 'boolean' ? isRequired : this.isRequired
    this.isPrivate = typeof isPrivate === 'boolean' ? isPrivate : this.isPrivate

    this.kind = this.kind || undefined
    this.options = this.options || undefined

    if (kind) {
      const klc = kind.toLowerCase()
      const supported = Object.keys(kinds)
      const old = {
        'textarea': 'String',
        'text': 'String',
        'enum': 'Select',
        'stamp': 'DateTime',
        'related': 'Record',
      }

      if (old[klc]) {
        // Migrating from old names
        kind = old[klc]
      } else if (!kinds[kind]) {
        // Migrating from old (lc) names
        const i = supported.map(k => k.toLowerCase()).findIndex(k => k === klc)
        if (i >= 0) {
          kind = supported[i]
        }
      }

      if (!kinds[kind]) {
        console.debug(`Field kind ${kind} is not supported. Supported field kinds: %o`, supported)
        throw Error(`Unsupported field kind ${kind}`)
      }

      this.kind = kind
      this.options = kinds[kind] ? new kinds[kind](options || {}) : {}
    }

    return this
  }

  clone () {
    return new Field(this)
  }

  // Are there any properties defined inside options object?
  // Assume object configurable if yes.
  isConfigurable () {
    return this.options && Object.keys(this.options).length > 0
  }
}
