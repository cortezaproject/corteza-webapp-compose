import { PropCast, ID } from 'corteza-webapp-common/src/lib/types/common'

export class Chart {
  constructor (o = {}) {
    this.chartID = PropCast(ID, o.chartID)
  }
}
