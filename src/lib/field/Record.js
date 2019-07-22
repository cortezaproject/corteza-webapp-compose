// @todo option to allow multiple entries
// @todo option to allow duplicates
// @todo option to define module to select records from
export class Record {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ moduleID, labelField, queryFields, selectType } = {}) {
    this.moduleID = moduleID ? (typeof moduleID === 'string' ? moduleID : undefined) : this.moduleID
    this.labelField = labelField || this.labelField || undefined
    this.queryFields = queryFields || this.queryFields || []
    this.selectType = selectType ? (typeof selectType === 'string' ? selectType : 'default') : 'default'
    return this
  }

  export () {
    return {
      labelField: this.labelField,
      queryFields: this.queryFields,
      selectType: this.selectType,
    }
  }
}
