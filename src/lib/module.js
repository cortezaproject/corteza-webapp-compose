import Field from './field'

const defMeta = () => Object.assign({}, {
  admin: {
    recordList: {
      columns: [],
    },
  },
})

export default class Module {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ moduleID, name, fields, meta }) {
    this.moduleID = typeof moduleID === 'string' ? moduleID : this.moduleID || ''
    this.name = typeof name === 'string' ? name : this.name || ''
    this.fields = Array.isArray(fields) ? fields.map(f => new Field(f)) : []
    this.meta = Object.assign(defMeta(), (typeof meta === 'object' ? meta : this.meta) || {})

    if ((this.meta.admin.recordList.columns || {}).length === 0) {
      // Copy fields into columns
      this.meta.admin.recordList.columns = this.fields.slice()
    }
  }

  // Returns array of fields from this module that are in requested list (array of field object or string).
  // Returned fields are orderd in the same way as requested
  filterFields (requested = []) {
    return requested.map(r => this.fields.find(f => (r.name || r) === f.name)).filter(f => f)
  }

  fieldNames () {
    return this.fields.map(f => f.name)
  }
}
