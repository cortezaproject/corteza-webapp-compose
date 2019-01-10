export class Automation {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ buttons } = {}) {
    this.buttons = buttons || this.buttons || []
    return this
  }
}
