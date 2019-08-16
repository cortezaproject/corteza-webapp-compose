export class RecordList {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ pageID, moduleID, fields, hideAddButton, hideHeader, hideSearch, hidePaging, hideSorting, prefilter, presort, perPage, allowExport } = {}) {
    this.pageID = pageID || undefined
    this.moduleID = moduleID || undefined
    this.fields = fields || []
    this.hideHeader = !!hideHeader
    this.hideAddButton = !!hideAddButton
    this.hideSearch = !!hideSearch
    this.hidePaging = !!hidePaging
    this.hideSorting = !!hideSorting
    this.allowExport = !!allowExport
    this.prefilter = prefilter
    this.presort = presort
    this.perPage = typeof perPage === 'number' ? perPage : 20
    return this
  }
}
