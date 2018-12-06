export class RecordList {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ pageID, moduleID, fields } = {}) {
    this.pageID = pageID || undefined
    this.moduleID = moduleID || undefined
    this.fields = fields || []
    return this
  }
}
