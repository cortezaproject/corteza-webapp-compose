export default class Namespace {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ namespaceID, name, slug, enabled, meta, createdAt, updatedAt, ...args }) {
    this.namespaceID = typeof namespaceID === 'string' ? namespaceID : this.namespaceID || ''
    this.name = typeof name === 'string' ? name : this.name || ''
    this.slug = typeof slug === 'string' ? slug : this.slug || ''
    this.enabled = typeof enabled === 'boolean' ? enabled : true
    this.meta = (meta !== undefined ? meta : this.meta) || {}

    const metaIncludes = ['subtitle', 'description']
    const metaKeys = Object.keys(this.meta)
    for (let inc of metaIncludes) {
      if (!metaKeys.includes(inc)) {
        this.meta[inc] = ''
      }
    }

    this.createdAt = createdAt || this.createdAt
    this.updatedAt = updatedAt || this.updatedAt

    this.canCreateChart =
      typeof args.canCreateChart === 'boolean' ? args.canCreateChart : false
    this.canCreateModule =
      typeof args.canCreateModule === 'boolean' ? args.canCreateModule : false
    this.canCreatePage =
      typeof args.canCreatePage === 'boolean' ? args.canCreatePage : false
    this.canCreateTrigger =
      typeof args.canCreateTrigger === 'boolean' ? args.canCreateTrigger : false
    this.canDeleteNamespace =
      typeof args.canDeleteNamespace === 'boolean' ? args.canDeleteNamespace : false
    this.canUpdateNamespace =
      typeof args.canUpdateNamespace === 'boolean' ? args.canUpdateNamespace : false
  }
}
