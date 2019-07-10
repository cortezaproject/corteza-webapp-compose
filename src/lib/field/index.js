import * as kinds from './loader'
import i18next from 'i18next'

export default class Field {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ fieldID, name, label, helpText, defaultValue, maxLength, isRequired, isPrivate, isMulti, isSystem, kind, options, ...args } = {}) {
    this.fieldID = typeof fieldID === 'string' ? fieldID : this.fieldID || '0'
    this.name = typeof name === 'string' ? name : this.name || ''
    this.label = typeof label === 'string' ? label : this.label || ''
    this.helpText = typeof helpText === 'string' ? helpText : this.helpText || ''
    this.defaultValue = defaultValue !== undefined ? defaultValue : this.defaultValue || undefined
    this.maxLength = typeof maxLength === 'number' ? maxLength : this.maxLength || 0
    this.isRequired = typeof isRequired === 'boolean' ? isRequired : this.isRequired
    this.isPrivate = typeof isPrivate === 'boolean' ? isPrivate : this.isPrivate
    this.isMulti = typeof isMulti === 'boolean' ? isMulti : this.isMulti
    this.isSystem = typeof isSystem === 'boolean' ? isSystem : this.isSystem

    if (this.isSystem) {
      this.canUpdateRecordValue = true
      this.canReadRecordValue = true
    } else {
      this.canUpdateRecordValue = typeof args.canUpdateRecordValue === 'boolean' ? args.canUpdateRecordValue : false
      this.canReadRecordValue = typeof args.canReadRecordValue === 'boolean' ? args.canReadRecordValue : false
    }

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
        'related_multi': 'Record',
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
        throw Error(i18next.t(`notification.field.unsupportedKind`, { kind }))
      }

      this.kind = kind
      this.options = kinds[kind] ? new kinds[kind](options || {}) : {}
    }

    return this
  }

  clone () {
    return new Field(this)
  }

  // Preforms basic validation and calls validate() function on type-specific options
  //
  // Returns an array of Error objects
  validate (value) {
    if (this.isRequired && (this.options.isEmpty ? this.options.isEmpty(value) : !value)) {
      return [i18next.t('notification.field.missingRequired')]
    }

    if (this.options && this.options.validate) {
      return this.options.validate(value)
    }

    return []
  }

  // Are there any properties defined inside options object?
  // Assume object configurable if yes.
  isConfigurable () {
    return this.options && Object.keys(this.options).length > 0
  }

  export () {
    return {
      name: this.name,
      label: this.label,
      helpText: this.helpText,
      defaultValue: this.defaultValue,
      maxLength: this.maxLength,
      isRequired: this.isRequired,
      isPrivate: this.isPrivate,
      isMulti: this.isMulti,
      isSystem: this.isSystem,
      kind: this.kind,
      options: this.options.export(),
    }
  }
}
