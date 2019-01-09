import Module from './module'

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
    this.values = {}
    this.module.fields.forEach(modField => {
      Object.defineProperty(this.values, modField.name, {
        configurable: false,
        enumerable: true,
        get: () => {
          return (this.fields.find(recField => recField.name === modField.name) || {}).value || undefined
        },

        set: (value) => {
          const ex = this.fields.find(recField => recField.name === modField.name)
          if (ex) {
            ex.value = value
          } else {
            this.fields.push({ name: modField.name, value })
          }
        },
      })
    })
  }

  merge ({ recordID, fields, createdAt, updatedAt, userID }) {
    this.recordID = typeof recordID === 'string' ? recordID : this.recordID || ''
    this.userID = typeof userID === 'string' ? userID : this.userID || ''
    this.createdAt = createdAt ? Date.parse(createdAt) : this.createdAt
    this.updatedAt = updatedAt ? Date.parse(updatedAt) : this.updatedAt
    this.fields = (Array.isArray(fields) ? fields : this.fields) || []
  }
}
