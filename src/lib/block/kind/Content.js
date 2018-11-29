import BlockOptionsInterface from './BlockOptionsInterface'

export class Content extends BlockOptionsInterface {
  constructor (def = {}) {
    super()
    this.merge(def)
  }

  merge ({ body } = {}) {
    this.body = body
  }
}
