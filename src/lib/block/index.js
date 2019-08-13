import * as kinds from './loader'

export default class Block {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ title, description, x, y, width, height, kind, options, style } = {}) {
    this.title = typeof title === 'string' ? title : this.title || ''
    this.description = typeof description === 'string' ? description : this.description || ''

    this.x = typeof x === 'number' ? x : this.x || 0
    this.y = typeof y === 'number' ? y : this.y || 0
    this.width = typeof width === 'number' ? width : this.width || 3
    this.height = typeof height === 'number' ? height : this.height || 3

    this.kind = this.kind || undefined
    this.options = this.options || undefined

    if (kind) {
      this.kind = kind
      this.options = new kinds[kind](options || {})
    }

    this.style = {
      variants: {
        headerBg: 'white',
        headerText: 'primary',
        bodyBg: 'white',
        border: 'primary',

        ...(style || {}).variants,
      },
    }
  }
}
