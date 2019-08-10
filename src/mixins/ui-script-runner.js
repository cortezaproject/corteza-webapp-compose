import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'
import Module from 'corteza-webapp-common/src/lib/types/compose/module'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import UserAgentScript from 'corteza-webapp-common/src/lib/types/shared/automation-ua-script'
import { ComposeObject } from 'corteza-webapp-common/src/lib/types/compose/common'
import contextHelpers from 'corteza-webapp-common/src/lib/corredor/api-helpers'
import { Abort } from 'corteza-webapp-common/src/lib/corredor/errors'
import i18next from 'i18next'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      getMatchingUAScripts: 'uaScript/getMatching',
      modules: 'module/set',
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
    async createRecord ($namespace, $module, $record) {
      const { moduleID } = $module
      const ctx = {
        $namespace,
        $module,
        $record,
      }

      return this.runScriptsByEvent('beforeCreate', moduleID, ctx, this.stdRecordEventProcessor)
        .then(({ $record }) => this.$ComposeAPI.recordCreate($record))
        .then(($record) => {
          $record.execHooks({ action: 'create', record: $record })

          // Update context with new data from before* scripts
          return { ...ctx, $record }
        })
        .then((ctx) => this.runScriptsByEvent('afterCreate', moduleID, ctx, this.stdRecordEventProcessor))
        .then(({ $record }) => $record)
    },

    /**
     * Orchestrates record update
     *
     * @param {Namespace} namespace
     * @param {Module} module
     * @param {Record} record
     * @returns {Promise<unknown>}
     */
    async updateRecord ($namespace, $module, $record) {
      const { moduleID } = $module
      const ctx = {
        $namespace,
        $module,
        $record,
      }

      return this.runScriptsByEvent('beforeUpdate', moduleID, ctx, this.stdRecordEventProcessor)
        .then(({ $record }) => this.$ComposeAPI.recordUpdate($record))
        .then(($record) => {
          $record.execHooks($record, { action: 'update', record: $record })

          // Update context with new data from before* scripts
          return { ...ctx, $record }
        })
        .then((ctx) => this.runScriptsByEvent('afterUpdate', moduleID, ctx, this.stdRecordEventProcessor))
        .then(({ $record }) => $record)
    },

    /**
     * Orchestrates record removal
     *
     * @param {Namespace} namespace
     * @param {Module} module
     * @param {Record} record
     * @returns {Promise<void>}
     */
    async deleteRecord ($namespace, $module, $record) {
      const { moduleID } = $module
      const ctx = {
        $namespace,
        $module,
        $record,
      }

      return this.runScriptsByEvent('beforeDelete', moduleID, ctx, this.stdRecordEventProcessor)
        .then(({ $record }) => {
          this.$ComposeAPI.recordDelete($record)

          // Update context with new data from before* scripts
          return { ...ctx, $record }
        })
        .then((ctx) => this.runScriptsByEvent('afterDelete', moduleID, ctx, this.stdRecordEventProcessor))
        .then(() => Promise.resolve(null))
    },

    stdRecordEventProcessor (ctx, result) {
      return { ...ctx, $record: result }
    },

    /**
     * Returns matching scripts
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
        var result = await this.run(s, ctx)

        if (!result) {
          // Abort!
          return Promise.reject(Error('aborted'))
        }

        ctx = processor(ctx, result)
      }

      // Run all matching scripts and then resolve the promise
      return Promise.resolve(ctx)
    },

    /**
     * Runs (through eval) script and resolves the results
     *
     * Async scripts resolve right away
     *
     * @param script
     * @param ctx
     * @returns {Promise<Promise<unknown>>}
     */
    async run (script, ctx = {}) {
      if (!(script instanceof UserAgentScript)) {
        throw new ReferenceError(`Expecting UserAgentScript object (got ${typeof script})`)
      }

      return new Promise(async (resolve, reject) => {
        if (script.async) {
          // Async call, resolve right away
          // @todo test how this behaves in UA env
          resolve()
        }

        try {
          // eval() does not play well with loaded classes
          // this workaround stores them in _classes obj
          // and creates a small snippet (loader) that is placed
          // inside eval script
          let _classes = {
            Module,
            Record,
            Namespace,
            Abort,
          }

          let evalClassLoader = ''
          for (let k in _classes) {
            evalClassLoader += `var ${k} = _classes.${k};\n`
          }
          // Cleanup
          evalClassLoader += `_classes=undefined;`

          const source = `${evalClassLoader}\n(function() {\n'use strict'; ${script.source};\n})()`
          // @todo console

          /* eslint-disable no-unused-vars */
          const $namespace = ctx.$namespace ? new Namespace(ctx.$namespace) : undefined
          const $module = ctx.$module ? new Module(ctx.$module) : undefined
          const $record = ctx.$record ? new Record(ctx.$record) : undefined

          // Map all helper functions to local scope
          const {
            MakeRecord,
            SaveRecord,
            DeleteRecord,

            FindRecords,
            FindRecordByID,
            FindModules,
            FindModuleByID,
            FindUsers,
            FindUserByID,

            SendEmail,
            SendMessageToChannel,
            SendDirectMessageToUser,
          } = contextHelpers({
            system: this.$SystemAPI,
            compose: this.$ComposeAPI,
            messaging: this.$MessagingAPI,
          }, {
            $namespace,
            $module,
            $record,
          })

          // Keeping `crust` for BC.
          // @todo can we wrap it in proxy and use some kind of console warning?
          /* eslint-disable no-unused-vars */
          const $C = this.buildLegacyContext({})
          const crust = $C

          /* eslint-disable no-eval */
          let rval = await eval(source)

          resolve(this.castResult(rval, { $record }))
        } catch (e) {
          return reject(e)
        }
      })
    },

    /**
     * Casts script runner results to something meaningful to the caller
     *
     * @param rval
     * @param ctx
     * @returns {Promise<unknown>|undefined|boolean|ComposeObject|*}
     */
    castResult (rval, ctx = {}) {
      if (rval === false) {
        // Script was explicitly aborted,
        // let the caller know
        return false
      }

      if (rval instanceof Promise) {
        return rval.then((v) => {
          // cast resolved value
          return this.castResult(v, ctx)
        }).catch(err => {
          if (!err) {
            // No error/value was given to rejection,
            // assuming we want tell the call we're canceling the operation
            return false
          } else {
            return Promise.reject(err)
          }
        })
      }

      if (rval instanceof ComposeObject) {
        // Value explicitly returned
        return rval
      }

      // Value was not explicitly returned,
      // pick one of ctx values (by order of importance)
      if (ctx.$record instanceof Record) {
        return ctx.$record
      }

      // Script was not aborted but there is really nothing
      // that we could return, so return undefined (and not false)
      return undefined
    },

    /**
     * Creates a basic context for trigger env
     *
     * @param {Object} ctx
     * @returns {PromiseLike<{filter: *, records: Record[]} | *> | Promise<{filter: *, records: Record[]} | *>|*|{$C: *}|PromiseLike<*> | Promise<*>|T}
     */
    buildLegacyContext (ctx) {
      const $system = this.$SystemAPI
      const $compose = this.$ComposeAPI
      const $messaging = this.$MessagingAPI

      // Assuming list of modules
      const modules = this.modules

      const openRecordPage = (name, record) => {
        const page = this.pages.find(p => p.moduleID === record.moduleID)
        if (!page) return
        this.$router.push({
          name,
          params: { pageID: page.pageID, recordID: record.recordID },
        })
      }

      const $C = {
        api: {
          record: {
            async save (record) {
              if (!(record instanceof Record)) {
                throw Error(i18next.t('notification.automation.expectingRecordObject'))
              }

              if (record.recordID === '') {
                return $compose.recordCreate(record)
              } else {
                return $compose.recordUpdate(record)
              }
            },

            async delete (record) {
              if (!(record instanceof Record)) {
                throw Error(i18next.t('notification.automation.expectingRecordObject'))
              }

              if (record.recordID !== '') {
                return $compose.recordDelete(record)
              }
            },

            // Finds single or multiple records
            //
            // When recordID is passed as an filter property (or as filter!) a single record
            // lookup is performed
            //
            // Other cases run record finder, properties passed to moduleRecordList:
            //  - filter   string, SQL-where-like, simple comparison and boolean expressions
            //  - page     integer, page number, 1-based
            //  - perPage  integer, limit record per page
            //  - sort     string, SQL-order-like, comma separated fields with ASC/DESC for direction
            //
            //
            async find (module, filter = {}) {
              if (!(module instanceof Module)) {
                throw Error(i18next.t('notification.automation.expectingModuleObject'))
              }

              let params = {
                namespaceID: module.namespaceID,
                moduleID: module.moduleID,
              }

              // Extract recordID from filter param
              // Scenarios:
              //   - as recordID or ID property of filter object
              //   - filter as string
              params.recordID = (filter || {}).recordID || (filter || {}).ID || (typeof filter === 'string' && /^[0-9]+$/.test(filter) ? filter : undefined)
              if (params.recordID) {
                return $compose.recordRead(params).then((r) => {
                  if (r.recordID === '0') {
                    // @todo remove when backend starts returning 404 on nonexistent records
                    return Promise.reject(Error(i18next.t('notification.automation.recordDoesNotExist')))
                  } else {
                    return new Record(module, r)
                  }
                })
              } else {
                if (typeof filter === 'string') {
                  params.filter = filter
                } else if (typeof filter === 'object') {
                  params = { ...params, ...filter }
                }

                return $compose.recordList(params).then(({ set, filter }) => {
                  return { filter, records: (set || []).map(r => new Record(module, r)) }
                })
              }
            },
          },

          module: {
            find (keyword) {
              return (modules || []).find(m => m.name === keyword || m.moduleID === keyword)
            },
          },

          user: {
            async find (keyword) {
              if (/^[0-9]+$/.test(keyword)) {
                return $system.userRead({ userID: keyword })
              } else {
                return $system.userList({ email: keyword }).then(({ set }) => {
                  if (set.length > 0) {
                    return set[0]
                  } else {
                    return null
                  }
                })
              }
            },
          },
        },

        helpers: {
          record: {
            page: {
              reload: () => {
                this.$emit('reload')
              },

              open: (record) => {
                if (!record) return
                openRecordPage('page.record', record)
              },

              edit: (record) => {
                if (!record) return
                openRecordPage('page.record.edit', record)
              },
            },

            new: (module, values = {}) => {
              if (typeof module === 'string') {
                // Find from list of modules by name or ID
                module = $C.api.module.find(module)
              }

              if (!(module instanceof Module)) {
                throw Error(i18next.t('notification.automation.expectingModuleObject'))
              }

              let record = new Record(module)

              // Set record values
              for (let p in values) {
                record.values[p] = values[p]
              }

              return record
            },
          },
        },

        fmt: {
          record: {
            toHTML: (record) => {
              let rows = record.module.fields.map(f => {
                const v = record.values[f.name]
                return `<tr><td>${f.label || f.name}</td><td>${v || ''}</td></tr>`
              })

              return `<table>${rows.join('')}</table>`
            },
          },
        },

        notify: {
          send: {
            email: ({ to, cc = [], subject, html }) => {
              $compose.notificationEmailSend({
                to: Array.isArray(to) ? to : [to],
                cc: Array.isArray(cc) ? cc : [cc],
                subject,
                content: { html },
              }).then((m) => {
                this.raiseSuccessAlert(m)
              }).catch((m) => {
                this.raiseWarningAlert(m)
              })
            },
            message: ({ channelID }, message) => {
              $messaging.messageCreate({ channelID, message })
            },
          },

          ui: {
            alert: {
              success: (text) => this.raiseSuccessAlert(text),
              error: (text) => this.raiseWarningAlert(text),
            },
          },
        },
      }

      return {
        ...ctx,
        $C,
      }
    },
  },
}
