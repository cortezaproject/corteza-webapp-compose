import Field from './field'

const defMeta = () => Object.assign({}, {
  admin: {
    recordList: {
      columns: [],
    },
  },
})

// @todo find a solution to translate system-fields labels
//       adding $t(...) all over the app is a bad solution
//       importing i18n lib here and translate is last resort

const systemFields = [
  { name: 'ownedBy', label: `Owned by`, kind: 'User' },
  { name: 'createdBy', label: `Created by`, kind: 'User' },
  { name: 'createdAt', label: `Created at`, kind: 'DateTime' },
  { name: 'updatedBy', label: `Updated by`, kind: 'User' },
  { name: 'updatedAt', label: `Updated at`, kind: 'DateTime' },
  { name: 'deletedBy', label: `Deleted by`, kind: 'User' },
  { name: 'deletedAt', label: `Deleted at`, kind: 'DateTime' },
].map(f => new Field({ ...f, isSystem: true }))

export default class Module {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ moduleID, namespaceID, name, fields, meta, createdAt, updatedAt, ...args }) {
    this.moduleID = typeof moduleID === 'string' ? moduleID : this.moduleID || ''
    this.namespaceID = typeof namespaceID === 'string' ? namespaceID : this.namespaceID || ''
    this.name = typeof name === 'string' ? name : this.name || ''
    this.fields = Array.isArray(fields) ? fields.map(f => new Field(f)) : []
    this.createdAt = createdAt || this.createdAt
    this.updatedAt = updatedAt || this.updatedAt
    this.canUpdateModule = typeof args.canUpdateModule === 'boolean' ? args.canUpdateModule : false
    this.canDeleteModule = typeof args.canDeleteModule === 'boolean' ? args.canDeleteModule : false
    this.canCreateRecord = typeof args.canCreateRecord === 'boolean' ? args.canCreateRecord : false
    this.canReadRecord = typeof args.canReadRecord === 'boolean' ? args.canReadRecord : false
    this.canUpdateRecord = typeof args.canUpdateRecord === 'boolean' ? args.canUpdateRecord : false
    this.canDeleteRecord = typeof args.canDeleteRecord === 'boolean' ? args.canDeleteRecord : false
    this.canManageAutomationTriggers = typeof args.canManageAutomationTriggers === 'boolean' ? args.canManageAutomationTriggers : false
    this.canGrant = typeof args.canGrant === 'boolean' ? args.canGrant : false

    // Properly convert old meta data that contained fields:
    if (Array.isArray(meta)) {
      meta = defMeta()
    }

    this.meta = Object.assign(defMeta(), (typeof meta === 'object' ? meta : this.meta) || {})

    if ((this.meta.admin.recordList.columns || {}).length === 0) {
      // Copy fields into columns
      this.meta.admin.recordList.columns = this.fields.slice()
    }
  }

  // Returns array of fields from this module that are in requested list (array of field object or string).
  // Returned fields are orderd in the same way as requested
  filterFields (requested = []) {
    return requested
      .map(r =>
        this.systemFields().find(f => (r.name || r) === f.name) ||
        this.fields.find(f => (r.name || r) === f.name))
      .filter(f => f)
  }

  fieldNames () {
    return this.fields.map(f => f.name)
  }

  systemFields () {
    return systemFields
  }

  export () {
    return this
  }

  import () {
    return this
  }
}
