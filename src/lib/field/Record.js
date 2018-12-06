// @todo option to allow multiple entries
// @todo option to allow duplicates
// @todo option to define module to select records from
export class Record {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ moduleID } = {}) {
    this.moduleID = typeof moduleID === 'string' ? moduleID : undefined

    return this
  }
}
