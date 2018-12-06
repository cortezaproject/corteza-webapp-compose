export class Record {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ moduleID, fields } = {}) {
    this.moduleID = moduleID || undefined
    this.fields = fields || []
    return this
  }
}
