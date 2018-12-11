export class RecordList {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ pageID, moduleID, fields, hideAddButton, hideSearch } = {}) {
    this.pageID = pageID || undefined
    this.moduleID = moduleID || undefined
    this.fields = fields || []
    this.hideAddButton = !!hideAddButton
    this.hideSearch = !!hideSearch
    return this
  }
}
