import Field from './field'

export default class Module {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ moduleID, name, fields }) {
    this.moduleID = typeof moduleID === 'string' ? moduleID : this.moduleID || ''
    this.name = typeof name === 'string' ? name : this.name || ''
    this.fields = Array.isArray(fields) ? fields.map(f => new Field(f)) : []
  }

  // Returns array of fields from this module that are in requested list (array of field object or string).
  // Returned fields are orderd in the same way as requested
  filterFields (requested = []) {
    return requested.map(r => this.fields.find(f => (r.name || r) === f.name)).filter(f => f)
  }
}
