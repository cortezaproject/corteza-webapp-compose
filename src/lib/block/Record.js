import BlockOptionsInterface from './BlockOptionsInterface'

export class Record extends BlockOptionsInterface {
  constructor (def = {}) {
    super()
    this.merge(def)
  }

  merge (def = {}) {
    // @todo
  }
}
