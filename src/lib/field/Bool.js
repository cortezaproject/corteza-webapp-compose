export class Bool {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ trueLabel, falseLabel } = {}) {
    this.trueLabel = trueLabel
    this.falseLabel = falseLabel

    return this
  }

  export () {
    return {
      trueLabel: this.trueLabel,
      falseLabel: this.falseLabel,
    }
  }
}
