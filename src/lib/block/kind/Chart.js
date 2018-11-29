import BlockOptionsInterface from './BlockOptionsInterface'

export class Chart extends BlockOptionsInterface {
  constructor (def = {}) {
    super()
    this.merge(def)
  }

  merge (def = {}) {
    // @todo
  }
}
