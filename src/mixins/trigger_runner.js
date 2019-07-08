import Record from '@/lib/record'
import Module from '@/lib/module'
import i18next from 'i18next'

export default {
  methods: {
    async createRecord (namespace, module, record) {
      let ctx = { namespace, module, record }

      return this.runTriggers({ ...ctx, action: 'beforeCreate' })
        .then(() => this.$ComposeAPI.recordCreate(record))
        .then((r) => {
          record.merge(r)
          record.execHooks({ action: 'create', record })
          return this.runTriggers({ ...ctx, action: 'afterCreate', record: new Record(module, record) })
        })
        .then(({ record }) => Promise.resolve(record))
    },

    async updateRecord (namespace, module, record) {
      let ctx = { namespace, module, record }

      return this.runTriggers({ ...ctx, action: 'beforeUpdate' })
        .then(() => this.$ComposeAPI.recordUpdate(record))
        .then((r) => {
          record.merge(r)
          record.execHooks(record, { action: 'update', record })
          return this.runTriggers({ ...ctx, action: 'afterUpdate', record: new Record(module, record) })
        })
        .then(({ record }) => Promise.resolve(record))
    },

    async deleteRecord (namespace, module, record) {
      let ctx = { namespace, module, record }

      return this.runTriggers({ ...ctx, action: 'beforeDelete' })
        .then(() => this.$ComposeAPI.recordDelete(record))
        .then((r) => this.runTriggers({ ...ctx, action: 'afterDelete' }))
        .then(() => Promise.resolve())
    },

    // Loads triggers, filters them according to context and runs them all
    async runTriggers (ctx) {
      ctx = this.triggerContext(ctx)
      const { namespace: { namespaceID } } = ctx

      return this.$store.dispatch('trigger/load', { namespaceID }).then(triggers => Promise.all(
        triggers
          .filter(t => t.runnable(ctx))
          .map(t => t.run(ctx))
      )).then(() => Promise.resolve(ctx))
    },

    // Creates a basic context for trigger env
    triggerContext (ctx) {
      const $system = this.$SystemAPI
      const $compose = this.$ComposeAPI
      const $messaging = this.$MessagingAPI

      ctx.modules = this.$store.getters['module/set']

      const openRecordPage = (name, record) => {
        const page = this.$store.getters['page/set'].find(p => p.moduleID === record.moduleID)
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
              return (ctx.modules || []).find(m => m.name === keyword || m.moduleID === keyword)
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
