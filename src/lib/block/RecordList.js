import { PropCast, ID } from 'corteza-webapp-common/src/lib/types/common'

export class RecordList {
  constructor (o = {}) {
    this.pageID = PropCast(ID, o.pageID)
    this.moduleID = PropCast(ID, o.moduleID)
    this.prefilter = PropCast(String, o.prefilter)
    this.presort = PropCast(String, o.presort)
    this.fields = o.fields
    this.hideHeader = !!o.hideHeader
    this.hideAddButton = !!o.hideAddButton
    this.hideSearch = !!o.hideSearch
    this.hidePaging = !!o.hidePaging
    this.hideSorting = !!o.hideSorting
    this.allowExport = !!o.allowExport
    this.perPage = o.perPage === 'number' ? o.perPage : 20
  }

  async fetch ($ComposeAPI, recordListModule, filter) {
    if (recordListModule.moduleID !== this.moduleID) {
      throw Error('Module incompatible, module mismatch')
    }

    filter.moduleID = this.moduleID
    filter.namespaceID = recordListModule.namespaceID

    return $ComposeAPI
      .recordList(filter)
      .then(({ filter = {}, set: records = [] }) => {
        return { records, filter }
      })
  }
}
