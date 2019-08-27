import Module from 'corteza-webapp-compose/src/lib/module.js'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import UserAgentScript from 'corteza-webapp-common/src/lib/types/shared/automation-ua-script'
import execInUA from 'corteza-webapp-common/src/lib/automation-scripts/exec-in-ua'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      getScriptByID: 'uaScript/getByID',
      getMatchingUAScripts: 'uaScript/getMatching',
      pages: 'page/set',
    }),
  },

  methods: {
    /**
     * Orchestrates record creation
     *
     * @param {Namespace} namespace
     * @param {Module} module
     * @param {Record} record
     * @returns {Promise<unknown>}
     */
    async createRecord (namespace, module, record) {
      const { moduleID } = module
      const ctx = {
        namespace,
        module,
        record,
      }

      return this.runScriptsByEvent('beforeCreate', moduleID, ctx, this.stdRecordEventProcessor)
        // unpacking record to make sure we're not carrying any references with us
        .then(({ record }) => this.$ComposeAPI.recordCreate({ ...record }))
        .then((apiResponse) => {
          let record = new Record(module, apiResponse)

          // Update context with new data from before* scripts
          return { ...ctx, record }
        })
        .then((ctx) => this.runScriptsByEvent('afterCreate', moduleID, ctx, this.stdRecordEventProcessor))
        .then(({ record }) => record)
    },

    /**
     * Orchestrates record update
     *
     * @param {Namespace} namespace
     * @param {Module} module
     * @param {Record} record
     * @returns {Promise<unknown>}
     */
    async updateRecord (namespace, module, record) {
      const { moduleID } = module
      const ctx = {
        namespace,
        module,
        record,
      }

      return this.runScriptsByEvent('beforeUpdate', moduleID, ctx, this.stdRecordEventProcessor)
        // unpacking record to make sure we're not carrying any references with us
        .then(({ record }) => this.$ComposeAPI.recordUpdate({ ...record }))
        .then((apiResponse) => {
          let record = new Record(module, apiResponse)

          // Update context with new data from before* scripts
          return { ...ctx, record }
        })
        .then((ctx) => this.runScriptsByEvent('afterUpdate', moduleID, ctx, this.stdRecordEventProcessor))
        .then(({ record }) => record)
    },

    /**
     * Orchestrates record removal
     *
     * @param {Namespace} namespace
     * @param {Module} module
     * @param {Record} record
     * @returns {Promise<void>}
     */
    async deleteRecord (namespace, module, record) {
      const { moduleID } = module
      const ctx = {
        namespace,
        module,
        record,
      }

      return this.runScriptsByEvent('beforeDelete', moduleID, ctx, this.stdRecordEventProcessor)
        .then(({ record }) => {
          // unpacking record to make sure we're not carrying any references with us
          this.$ComposeAPI.recordDelete({ ...record })

          // Update context with new data from before* scripts
          return { ...ctx, record }
        })
        .then((ctx) => this.runScriptsByEvent('afterDelete', moduleID, ctx, this.stdRecordEventProcessor))
        .then(() => Promise.resolve(null))
    },

    stdRecordEventProcessor (ctx, result) {
      return { ...ctx, record: result }
    },

    /**
     * Runs all matching scripts (by event & condition)
     *
     * @param {string} event
     * @param {string} condition
     * @param {Object} ctx
     * @param {Function} processor - result processor
     * @returns {Promise<(*|Promise<Promise<unknown>>)[]>}
     */
    async runScriptsByEvent (event, condition, ctx = {}, processor = (ctx, result) => ctx) {
      const scripts = this.getMatchingUAScripts(event, condition) || []

      for (var s of scripts) {
        let result = await this.runUAScript(s, ctx)

        if (result === undefined) {
          // Async script
          continue
        }

        ctx = processor(ctx, result)
      }

      // Run all matching scripts and then resolve the promise
      return Promise.resolve(ctx)
    },

    /**
     * Loads script and runs it (in UA or Corredor, depends on the script's runInUA flag)
     *
     * It normalizes return value from both realms:
     * Backend will return an key-value struct { record, ...} that we extract, cast and return
     * UA runner returns record (or whatever else we'll support directly
     *
     *
     * @param scriptID
     * @param ctx
     * @returns {Promise<PromiseLike<any> | Promise<any>|*|Promise>}
     */
    async runScripByID (scriptID, ctx = {}) {
      const script = this.getScriptByID(scriptID)

      if (script.runInUA) {
        // Running script in a browser
        return this.runUAScript(script, ctx)
      } else {
        // Sending script-run request to the backend
        // and prepare to cast received values
        const payload = {
          // Send IDs
          scriptID,
          namespaceID: ctx.namespace.namespaceID,
          moduleID: ctx.module.moduleID,

          // Send the record payload, serialized
          record: { ...ctx.record, module: undefined, values: ctx.record.serializeValues() },
        }

        return this.$ComposeAPI.automationScriptRun(payload).then(({ record }) => {
          if (record) {
            // Assuming type Record
            return new Record(ctx.module, record)
          }

          return undefined
        })
      }
    },

    /**
     * Script runner
     *
     * Runs script:
     * !async:
     *   will resolve (result of a script) after script is executed
     *   can reject if script is aborted (return false for example)
     *
     * async:
     *   will always resolve with undefined
     *
     * @param {UserAgentScript} script
     * @param {Object} ctx
     * @returns {Promise}
     */
    async runUAScript (script, ctx = {}) {
      if (!(script instanceof UserAgentScript)) {
        throw new ReferenceError(`Expecting UserAgentScript object (got ${typeof script})`)
      }

      // Current user
      ctx.authUser = this.$auth ? this.$auth.user : {}

      // Map API clients
      ctx.ComposeAPI = this.$ComposeAPI
      ctx.MessagingAPI = this.$MessagingAPI
      ctx.SystemAPI = this.$SystemAPI
      ctx.pages = this.pages

      // We need to override Module class from the common with one from the compose
      // @todo remove this when module & module fields are fully ported to common lib
      ctx.Module = Module

      if (script.async) {
        // Execute async script, ignore the results
        // and go to the next script right away
        setTimeout(async () => {
          await execInUA(script.source, { ...ctx }, script)
        }, 0)
        return Promise.resolve(undefined)
      }

      // Attach route pusher & emitter after async
      // our env can not be affected by async scripts!
      ctx.routePusher = (params) => this.$router.push(params)
      ctx.emitter = (name, params) => this.$root.$emit(name, params)

      var result = await execInUA(script.source, ctx, script)

      if (!result) {
        // Abort!
        return Promise.reject(Error('aborted'))
      }

      return Promise.resolve(result)
    },
  },
}
