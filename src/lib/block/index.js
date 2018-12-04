import * as kinds from './kind'

export default class Block {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ title, theme, description, x, y, width, height, kind, options } = {}) {
    this.title = typeof title === 'string' ? title : this.title || ''
    this.theme = typeof theme === 'string' ? theme : this.theme || ''
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
  }
}
