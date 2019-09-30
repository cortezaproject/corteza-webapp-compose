import * as kinds from './loader'

export default class Block {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ title, description, xywh, kind, options, style } = {}) {
    this.title = typeof title === 'string' ? title : this.title || ''
    this.description = typeof description === 'string' ? description : this.description || ''

    this.xywh = [0, 0, 3, 3]
    if (Array.isArray(xywh) && xywh.length === 4) {
      this.xywh = xywh
    } else {
      console.log('xywh not compatible', xywh)
    }

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
