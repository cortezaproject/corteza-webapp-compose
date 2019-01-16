import Module from './module'

// Internal record values representation, array of objects
const internal = Symbol('internal')

// External record values representation, object (key-value)
const external = Symbol('external')

const fields = Symbol('moduleFieldIndex')

// Record class
export default class Record {
  constructor (module, def = {}) {
    // setup() will help us to proxy value to field propery
    if (module instanceof Module) {
      this.module = module
      this.moduleID = module.moduleID

      this[fields] = {}
      this.module.fields.forEach(({ name, isMulti, kind }) => {
        this[fields][name] = { isMulti, kind }
      })
    } else if (module === undefined) {
      throw new Error(`Record module not defined`)
    } else {
      throw new Error(`Unexpected value for record module (${typeof module})`)
    }

    this.setupValues()
    this.merge(def)
  }

  setupValues () {
    this[internal] = []
    this[external] = {}

    this.module.fields.forEach(modField => {
      Object.defineProperty(this[external], modField.name, {
        configurable: false,
        enumerable: true,
        get: () => this.getValue(modField.name),
        set: (value) => this.setValue(modField.name, value),
      })
    })

    // When serializing into JSON, make sure internal values are outputed
    // so that we do not confuse API
    this[external].toJSON = (key) => {
      return this[internal]
    }
  }

  getValue (name) {
    const { isMulti = false, kind } = this[fields][name]

    if (kind === undefined) {
      throw new Error(`Could not get value from an undefined field or field-kind (${name})`)
    }

    if (isMulti) {
      return this[internal].filter(r => r.name === name).map(r => r.value)
    } else {
      return (this[internal].find(r => r.name === name) || {}).value || undefined
    }
  }

  setValue (name, value) {
    const { isMulti = false, kind } = this[fields][name]

    if (kind === undefined) {
      throw new Error(`Could not assign value to an undefined field or field-kind (${name})`)
    }

    const ex = this[internal].find(recField => recField.name === name)

    if (isMulti) {
      // Remove existing
      this[internal] = this[internal].filter(r => r.name !== name)
      if (Array.isArray(value)) {
        value.forEach(vitem => this[internal].push({ name, value: vitem }))
      } else {
        this[internal].push({ name, value })
      }
    } else if (ex) {
      // Existing value... modify value
      ex.value = value
    } else {
      // Not multi, or non-existing, just push to stack1
      this[internal].push({ name, value })
    }
  }

  get values () {
    return this[external]
  }

  set values (values) {
    if (Array.isArray(values)) {
      // filter(), allow only fields supported by this module
      values.filter(({ name }) => this[fields][name] !== undefined).forEach(({ name, value }) => {
        const ex = this[internal].find(r => r.name === name)
        if (this[fields][name].isMulti || !ex) {
          this[internal].push({ name, value })
        } else {
          ex.value = value
        }
      })
    } else if (typeof values === 'object') {
      // We're setting the entire value set, cleanup first
      this[internal] = []

      for (let k in values) {
        this.setValue(k, values[k])
      }
    } else {
      throw new Error(`Unexpected input for values property, should be an array with name-value object pairs or an object`)
    }
  }

  merge ({ recordID, values, createdAt, updatedAt, userID }) {
    this.recordID = typeof recordID === 'string' ? recordID : this.recordID || ''
    this.userID = typeof userID === 'string' ? userID : this.userID || ''
    this.createdAt = createdAt ? Date.parse(createdAt) : this.createdAt
    this.updatedAt = updatedAt ? Date.parse(updatedAt) : this.updatedAt

    if (values !== undefined) {
      this.values = values
    }
  }

  toJSON (key) {
    return { ...this, values: this[internal] }
  }
}
