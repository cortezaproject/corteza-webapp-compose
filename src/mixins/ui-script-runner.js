import { compose } from '@cortezaproject/corteza-js'
// import UserAgentScript from 'corteza-webapp-common/src/lib/types/shared/automation-ua-script'
// import execInUA from 'corteza-webapp-common/src/lib/automation-scripts/exec-in-ua'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      // getScriptByID: 'uaScript/getByID',
      // getMatchingUAScripts: 'uaScript/getMatching',
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
     * @returns {Promise<Record>}
     */
    async createRecord (namespace, module, record) {
      const { moduleID } = module
      const ctx = {
        $namespace: namespace,
        $module: module,
        $record: record,
      }

      return this
        // automation (running UA scripts on beforeCreate event)
        .runScriptsByEvent('beforeCreate', moduleID, ctx, this.stdRecordEventProcessor)

        // send record to the API
        .then(({ $record }) => this.$ComposeAPI.recordCreate($record))

        // convert record we got back from the API
        .then((record) => new compose.Record(module, record))

        // automation (running UA scripts on afterCreate event)
        .then($record => this.runScriptsByEvent('afterCreate', moduleID, { ...ctx, $record }, this.stdRecordEventProcessor))

        // Extract & return record
        .then(({ $record }) => $record)
    },

    /**
     * Orchestrates record update
     *
     * @param {Namespace} namespace
     * @param {Module} module
     * @param {Record} record
     * @returns {Promise<Record>}
     */
    async updateRecord (namespace, module, record) {
      const { moduleID } = module
      const ctx = {
        $namespace: namespace,
        $module: module,
        $record: record,
      }

      return this
        // automation (running UA scripts on beforeUpdate event)
        .runScriptsByEvent('beforeUpdate', moduleID, ctx, this.stdRecordEventProcessor)

        // send record to the API
        .then(({ $record }) => this.$ComposeAPI.recordUpdate($record))

        // convert record we got back from the API
        .then((record) => new compose.Record(module, record))

        // automation (running UA scripts on afterUpdate event)
        .then($record => this.runScriptsByEvent('afterUpdate', moduleID, { ...ctx, $record }, this.stdRecordEventProcessor))

        // Extract & return record
        .then(({ $record }) => $record)
    },

    /**
     * Orchestrates record removal
     *
     * @param {Namespace} namespace
     * @param {Module} module
     * @param {Record} record
     * @returns {Promise<null>}
     */
    async deleteRecord (namespace, module, record) {
      const { moduleID } = module
      const ctx = {
        $namespace: namespace,
        $module: module,
        $record: record,
      }

      return this
        // automation (running UA scripts on beforeDelete event)
        .runScriptsByEvent('beforeDelete', moduleID, ctx, this.stdRecordEventProcessor)

        // send delete request
        .then(({ $record }) => this.$ComposeAPI.recordDelete($record))

        // automation (running UA scripts on afterDelete event)
        // no record is returned on-delete event, so we'll reuse the old one
        // (we also create new instance to avoid ref leak)
        .then(() => this.runScriptsByEvent('afterDelete', moduleID, { ...ctx, $record: new compose.Record(module, record) }, this.stdRecordEventProcessor))

        // return null
        .then(() => null)
    },

    /**
     * Record event processor
     *
     * Used as a runScriptsByEvent callback to process results and map them back to context
     *
     * Used as a param for
     * @param ctx
     * @param result
     * @returns {{record: *}}
     */
    stdRecordEventProcessor (ctx, result) {
      throw Error('SHOULD NOT BE CALLED ANYMORE')
      // return { ...ctx, $record: result }
    },

    /**
     * Runs all matching scripts (by event & condition)
     *
     * @param {string} event
     * @param {string} condition
     * @param {Object} ctx
     * @param {Function} processor - result processor
     * @returns {Promise<(*>)[]>}
     */
    async runScriptsByEvent (event, condition, ctx = {}, processor = (ctx, result) => ctx) {
      const scripts = this.getMatchingUAScripts(event, condition) || []

      for (const s of scripts) {
        const result = await this.runUAScript(s, ctx)

        if (result === false) {
          // Async script
          return false
        }
      }

      // Run all matching scripts and then resolve the promise
      return ctx
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
        const {
          $record,
          $namespace,
          $module,
        } = ctx

        // Sending script-run request to the backend
        // and prepare to cast received values
        const payload = {
          // Send IDs
          scriptID,
          namespaceID: $namespace.namespaceID,
          moduleID: $module.moduleID,

          // Send the record payload, serialized
          record: { ...$record, module: undefined, values: $record.serializeValues() },
        }

        return this.$ComposeAPI.automationScriptRun(payload).then(({ record }) => {
          if (record) {
            // Assuming type Record
            return new compose.Record($module, record)
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
      // if (!(script instanceof UserAgentScript)) {
      //   throw new ReferenceError(`Expecting UserAgentScript object (got ${typeof script})`)
      // }
      //
      // // Current user
      // ctx.authUser = this.$auth ? this.$auth.user : {}
      //
      // // Map API clients
      // ctx.ComposeAPI = this.$ComposeAPI
      // ctx.MessagingAPI = this.$MessagingAPI
      // ctx.SystemAPI = this.$SystemAPI
      // ctx.pages = this.pages
      //
      // // We need to override Module class from the common with one from the compose
      // // @todo remove this when module & module fields are fully ported to common lib
      // ctx.Module = compose.Module
      //
      // if (script.async) {
      //   // Execute async script, ignore the results
      //   // and go to the next script right away
      //   setTimeout(async () => {
      //     await execInUA(script.source, { ...ctx }, script)
      //   }, 0)
      //   return Promise.resolve(undefined)
      // }
      //
      // // Attach route pusher & emitter after async
      // // our env can not be affected by async scripts!
      // ctx.routePusher = (params) => this.$router.push(params)
      // ctx.emitter = (name, params) => this.$root.$emit(name, params)
      //
      // var result = await execInUA(script.source, ctx, script)
      //
      // if (!result) {
      //   // Abort!
      //   return Promise.reject(Error('aborted'))
      // }
      //
      // return Promise.resolve(result)
    },
  },
}
