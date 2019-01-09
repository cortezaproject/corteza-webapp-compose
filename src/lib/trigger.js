import safeEval from 'safe-eval'

export default class Trigger {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ triggerID, name, moduleID, actions, source, enabled }) {
    this.triggerID = (typeof triggerID === 'string' ? triggerID : this.triggerID) || ''
    this.moduleID = (typeof moduleID === 'string' ? moduleID : this.moduleID) || null
    this.name = (typeof name === 'string' ? name : this.name) || ''
    this.source = (typeof source === 'string' ? source : this.source) || ''
    this.enabled = (typeof enabled === 'boolean' ? enabled : this.enabled) || true

    if (Array.isArray(actions)) {
      this.actions = actions.filter(a => !!a)
    } else if (typeof actions === 'string') {
      this.actions = actions.split(',').map(a => a.trim()).filter(a => !!a)
    }
  }

  // Is trigger runnable?
  runnable ({ module, action }) {
    if (!this.enabled) {
      console.debug('Trigger [%s] "%s" not runnable: disabled', this.triggerID, this.name)
      return false
    }

    if (module.moduleID !== this.moduleID) {
      console.debug('Trigger [%s] "%s" not runnable: module mismatch', this.triggerID, this.name, module.moduleID, this.moduleID)
      return false
    }

    if (this.actions.find(a => action) === undefined) {
      console.debug('Trigger [%s] "%s" not runnable: action (%s) mismatch [%o]', this.triggerID, this.name, action, this.actions)
      return false
    }

    if (this.source.trim().length === 0) {
      console.debug('Trigger [%s] "%s" not runnable: no code', this.triggerID, this.name)
      return false
    }

    console.debug('Trigger [%s] "%s" is runnable', this.triggerID, this.name)
    return true
  }

  run (ctx) {
    if (this.source.trim().length === 0) {
      return undefined
    }

    // Wrap into self-executing function and
    const source = `(function() {${this.source};\n return true;})()`

    console.debug('Running trigger [%s] "%s": %s', this.triggerID, this.name, source)
    const rval = safeEval(source, ctx)
    console.debug('Trigger [%s] "%s" returned: %o', this.triggerID, this.name, rval)
    return rval
  }
}
