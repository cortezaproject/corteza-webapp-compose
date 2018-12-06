export class Content {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ body } = {}) {
    this.body = body
    return this
  }
}
