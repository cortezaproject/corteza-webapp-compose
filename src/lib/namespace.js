export default class Namespace {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ namespaceID, name, meta, createdAt, updatedAt }) {
    this.namespaceID = typeof namespaceID === 'string' ? namespaceID : this.namespaceID || ''
    this.namespaceID = typeof namespaceID === 'string' ? namespaceID : this.namespaceID || ''
    this.name = typeof name === 'string' ? name : this.name || ''
    this.createdAt = createdAt || this.createdAt
    this.updatedAt = updatedAt || this.updatedAt
  }
}
