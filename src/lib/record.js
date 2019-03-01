import Module from './module'

const fields = Symbol('moduleFieldIndex')

// Record class
export default class Record {
  constructor (module, def = {}) {
    this.hooks = []

    // setup() will help us to proxy value to field propery
    if (module instanceof Module) {
      this.module = module
      this.moduleID = module.moduleID

      this[fields] = {}
      this.module.fields.forEach(({ name, isMulti, kind }) => {
        this[fields][name] = { isMulti, kind }
      })

      this.values = {
        toJSON: () => {
          // Remove unneeded properties
          return this.serialize(this.values)
        },
      }

      this.module.fields.forEach(({ name, isMulti, kind }) => {
        this[fields][name] = { isMulti, kind }
        this.values[name] = isMulti ? [] : undefined
      })
    } else if (module === undefined) {
      throw new Error(`Record module not defined`)
    } else {
      throw new Error(`Unexpected value for record module (${typeof module})`)
    }

    this.merge(def)
  }

  merge ({ recordID, values, createdAt, updatedAt, ownerdBy, createdBy, updatedBy, deletedBy }) {
    this.recordID = typeof recordID === 'string' ? recordID : this.recordID || ''
    this.ownerdBy = typeof ownerdBy === 'string' ? ownerdBy : this.ownerdBy || ''
    this.createdBy = typeof createdBy === 'string' ? createdBy : this.createdBy || ''
    this.updatedBy = typeof updatedBy === 'string' ? updatedBy : this.updatedBy || ''
    this.deletedBy = typeof deletedBy === 'string' ? deletedBy : this.deletedBy || ''
    this.createdAt = createdAt || this.createdAt || null
    this.updatedAt = updatedAt || this.updatedAt || null
    this.deletedBy = deletedBy || this.deletedBy || null

    if (values !== undefined && Array.isArray(values)) {
      this.unserialize(values)
    } else if (typeof values === 'object') {
      this.values = values
    }
  }

  serialize (values = {}) {
    let arr = []

    for (let name in this.values) {
      if (this[fields][name] === undefined) {
        continue
      }

      const { isMulti = false } = this[fields][name]

      if (isMulti) {
        if (Array.isArray(values[name])) {
          for (let i = 0; i < values[name].length; i++) {
            if (values[name][i] !== undefined) {
              arr.push({ name, value: values[name][i].toString() })
            }
          }
        }
      } else if (values[name] !== undefined) {
        arr.push({ name, value: values[name].toString() })
      }
    }

    return arr
  }

  unserialize (arr = []) {
    // Handling backend (array based) payload
    if (Array.isArray(arr)) {
      arr.filter(({ name }) => this[fields][name] !== undefined).forEach(({ name, value }) => {
        const { isMulti = false } = this[fields][name]
        if (isMulti) {
          this.values[name].push(value)
        } else {
          this.values[name] = value
        }
      })
    } else {
      throw new Error(`Unexpected input for values property, should be an array with name-value object pairs`)
    }
  }

  isValid () {
    return this.module.fields
      .map(f => f.validate(this.values[f.name]).length === 0)
      .filter(v => !v).length === 0
  }

  // Add custom, runtime hooks on fields
  // These hooks will be executed in order they are added
  //
  // We use these hooks mainly to handle upload on File field type
  addHook (hook) {
    this.hooks.push(hook)
  }

  // Execute hooks
  execHooks () {
    for (const hook of this.hooks) {
      hook.apply(this, arguments)
    }
  }
}
