import Module from './module'

const RecordValues = Symbol('values')

// Record class
export default class Record {
  constructor (module, def = {}) {
    // setup() will help us to proxy value to field propery
    if (module instanceof Module) {
      this.module = module
      this.moduleID = module.moduleID
    } else {
      throw new Error(`Unexpected value for record module (${typeof module})`)
    }
    this.setup()
    this.merge(def)
  }

  setup () {
    this[RecordValues] = {}

    this.module.fields.forEach(modField => {
      Object.defineProperty(this[RecordValues], modField.name, {
        configurable: false,
        enumerable: true,
        get: () => this.getValue(modField.name),
        set: (value) => this.setValue(modField.name, value),
      })
    })
  }

  getValue (name) {
    return (this.fields.find(recField => recField.name === name) || {}).value || undefined
  }

  setValue (name, value) {
    const ex = this.fields.find(recField => recField.name === name)
    if (ex) {
      ex.value = value
    } else {
      this.fields.push({ name: name, value })
    }
  }

  get values () {
    return this[RecordValues]
  }

  set values (kv) {
    if (typeof kv === 'object') {
      for (let k in kv) {
        this.setValue(k, kv[k])
      }
    }
  }

  merge ({ recordID, fields, createdAt, updatedAt, userID }) {
    this.recordID = typeof recordID === 'string' ? recordID : this.recordID || ''
    this.userID = typeof userID === 'string' ? userID : this.userID || ''
    this.createdAt = createdAt ? Date.parse(createdAt) : this.createdAt
    this.updatedAt = updatedAt ? Date.parse(updatedAt) : this.updatedAt
    this.fields = (Array.isArray(fields) ? fields : this.fields) || []
  }
}
