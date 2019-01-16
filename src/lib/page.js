import Block from './block'

export default class Page {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ pageID, selfID, moduleID, title, description, blocks, visible = true, createdAt, updatedAt }) {
    this.pageID = (typeof pageID === 'string' ? pageID : this.pageID) || ''
    this.selfID = (typeof selfID === 'string' && selfID !== '0' ? selfID : this.selfID) || null
    this.moduleID = (typeof moduleID === 'string' && moduleID !== '0' ? moduleID : this.moduleID) || null
    this.title = typeof title === 'string' ? title : this.title || ''
    this.description = typeof description === 'string' ? description : this.description || ''
    this.blocks = (Array.isArray(blocks) ? blocks.map(b => new Block(b)) : this.blocks) || []
    this.visible = typeof visible === 'boolean' ? visible : this.visible
    this.createdAt = createdAt || this.createdAt
    this.updatedAt = updatedAt || this.updatedAt
  }
}
