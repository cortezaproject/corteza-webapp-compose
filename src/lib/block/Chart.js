export class Chart {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ chartID } = {}) {
    this.chartID = chartID
    return this
  }
}
