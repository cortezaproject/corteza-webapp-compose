import i18next from '../i18next'

export default class Trigger {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ triggerID, namespaceID, name, moduleID, actions, source, enabled, createdAt, updatedAt, ...args }) {
    this.triggerID = (typeof triggerID === 'string' ? triggerID : this.triggerID) || ''
    this.namespaceID = typeof namespaceID === 'string' ? namespaceID : this.namespaceID || ''
    this.moduleID = (typeof moduleID === 'string' ? moduleID : this.moduleID) || null
    this.name = (typeof name === 'string' ? name : this.name) || ''
    this.source = (typeof source === 'string' ? source : this.source) || ''
    this.enabled = !!(typeof enabled === 'boolean' ? enabled : this.enabled)
    this.createdAt = createdAt || this.createdAt
    this.updatedAt = updatedAt || this.updatedAt
    this.canUpdateTrigger = typeof args.canUpdateTrigger === 'boolean' ? args.canUpdateTrigger : false
    this.canDeleteTrigger = typeof args.canDeleteTrigger === 'boolean' ? args.canDeleteTrigger : false
    this.canGrant = typeof args.canGrant === 'boolean' ? args.canGrant : false

    if (Array.isArray(actions)) {
      this.actions = actions.filter(a => !!a)
    } else if (typeof actions === 'string') {
      this.actions = actions.split(',').map(a => a.trim()).filter(a => !!a)
    }
  }

  // Is trigger runnable?
  runnable ({ triggerID, module, action }) {
    if (!this.enabled) {
      // console.debug('Trigger [%s] "%s" not runnable: disabled', this.triggerID, this.name)
      return false
    }

    if (triggerID && triggerID !== this.triggerID) {
      return false
    }

    if (module && module.moduleID !== this.moduleID) {
      // console.debug('Trigger [%s] "%s" not runnable: module mismatch', this.triggerID, this.name, module.moduleID, this.moduleID)
      return false
    }

    if (this.actions.find(a => a === action) === undefined) {
      // console.debug('Trigger [%s] "%s" not runnable: action (%s) mismatch [%o]', this.triggerID, this.name, action, this.actions)
      return false
    }

    if (this.source.trim().length === 0) {
      // console.debug('Trigger [%s] "%s" not runnable: no code', this.triggerID, this.name)
      return false
    }

    // console.debug('Trigger [%s] "%s" is runnable', this.triggerID, this.name)
    return true
  }

  async run ({ crust, module, record, action }) {
    if (this.source.trim().length === 0) {
      return Promise.resolve()
    }

    const source = `(async function() {\n${this.source};\n return true;})()`

    try {
      /* eslint-disable no-eval */
      if (await eval(source)) {
        return Promise.resolve(true)
      } else {
        return Promise.reject(new Error(i18next.t('notification.automation.execError')))
      }
    } catch (e) {
      return Promise.reject(e)
    }
  }

  async export (findModuleByID) {
    let copy = new Trigger(this)
    if (this.moduleID) {
      const { namespaceID, moduleID } = this
      const module = await findModuleByID({ namespaceID, moduleID })
      copy.moduleID = module.name
    }
    return copy
  }

  import (getModuleID) {
    let copy = new Trigger(this)
    const { moduleID } = copy
    if (moduleID) {
      copy.moduleID = getModuleID(moduleID)
    }
    return copy
  }
}
