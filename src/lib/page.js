import Block from './block'

export default class Page {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ pageID, namespaceID, selfID, moduleID, title, description, blocks, visible = true, createdAt, updatedAt, ...args }) {
    this.pageID = (typeof pageID === 'string' ? pageID : this.pageID) || ''
    this.selfID = (typeof selfID === 'string' && selfID !== '0' ? selfID : this.selfID) || null
    this.namespaceID = typeof namespaceID === 'string' ? namespaceID : this.namespaceID || ''
    this.moduleID = (typeof moduleID === 'string' && moduleID !== '0' ? moduleID : this.moduleID) || null
    this.title = typeof title === 'string' ? title : this.title || ''
    this.description = typeof description === 'string' ? description : this.description || ''
    this.blocks = (Array.isArray(blocks) ? blocks.map(b => new Block(b)) : this.blocks) || []
    this.visible = typeof visible === 'boolean' ? visible : this.visible
    this.createdAt = createdAt || this.createdAt
    this.updatedAt = updatedAt || this.updatedAt
    this.canUpdatePage = typeof args.canUpdatePage === 'boolean' ? args.canUpdatePage : false
    this.canDeletePage = typeof args.canDeletePage === 'boolean' ? args.canDeletePage : false
    this.canGrant = typeof args.canGrant === 'boolean' ? args.canGrant : false
  }

  export () {
    return {
      title: this.title,
      description: this.description,
      visible: this.visible,
      blocks: this.blocks,
    }
  }
}
