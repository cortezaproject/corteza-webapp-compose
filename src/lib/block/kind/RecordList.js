import BlockOptionsInterface from './BlockOptionsInterface'

export class RecordList extends BlockOptionsInterface {
  constructor (def = {}) {
    super()
    this.merge(def)
  }

  merge ({ pageID, moduleID, fields } = {}) {
    this.pageID = pageID || undefined
    this.moduleID = moduleID || undefined
    this.fields = fields || []
  }
}
