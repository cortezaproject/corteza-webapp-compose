import { PropCast, ID } from 'corteza-webapp-common/src/lib/types/common'

export class Record {
  constructor (o = {}) {
    this.moduleID = PropCast(ID, o.moduleID)
    this.fields = o.fields || []
  }
}
