import Record from '@/lib/record'
import Module from '@/lib/module'

export default {
  methods: {
    async createRecord (module, record) {
      let ctx = { module, record }

      return this.runTriggers({ ...ctx, action: 'beforeCreate' })
        .then(() => this.$crm.moduleRecordCreate(record))
        .then((r) => this.runTriggers({ ...ctx, action: 'afterCreate', record: new Record(module, r) }))
        .then((ctx) => Promise.resolve(ctx.record))
    },

    async updateRecord (module, record) {
      let ctx = { module, record }

      return this.runTriggers({ ...ctx, action: 'beforeUpdate' })
        .then(() => this.$crm.moduleRecordUpdate(record))
        .then((r) => this.runTriggers({ ...ctx, action: 'afterUpdate', record: new Record(module, r) }))
        .then((ctx) => Promise.resolve(ctx.record))
    },

    async deleteRecord (module, record) {
      let ctx = { module, record }

      return this.runTriggers({ ...ctx, action: 'beforeDelete' })
        .then(() => this.$crm.moduleRecordDelete(record))
        .then((r) => this.runTriggers({ ...ctx, action: 'afterDelete' }))
        .then(() => Promise.resolve())
    },

    // Loads triggers, filters them according to context and runs them all
    async runTriggers (ctx) {
      ctx = this.triggerContext(ctx)
      return this.$store.dispatch('trigger/load').then(triggers => Promise.all(
        triggers
          .filter(t => t.runnable(ctx))
          .map(t => t.run(ctx))
      )).then(() => Promise.resolve(ctx))
    },

    // Creates a basic context for trigger env
    triggerContext (ctx) {
      const $crm = this.$crm
      const $system = this.$system
      const $messaging = this.$messaging

      ctx.modules = this.$store.getters['module/set']

      const crust = {
        api: {
          record: {
            async save (record) {
              if (!(record instanceof Record)) {
                throw Error('Expecting Record object')
              }

              if (record.recordID === '') {
                return $crm.moduleRecordCreate(record)
              } else {
                return $crm.moduleRecordUpdate(record)
              }
            },

            async delete (record) {
              if (!(record instanceof Record)) {
                throw Error('Expecting Record object')
              }

              if (record.recordID !== '') {
                return $crm.moduleRecordDelete(record)
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
                return $system.userList({ email: keyword }).then(uu => {
                  if (uu.length > 0) {
                    return uu[0]
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

                const page = this.$store.getters['page/set'].find(p => p.moduleID === record.moduleID)
                if (!page) return
                this.$router.push({
                  name: 'public.page.record',
                  params: { pageID: page.pageID, recordID: record.recordID },
                })
              },
            },

            new: (module, values = {}) => {
              if (typeof module === 'string') {
                // Find from list of modules by name or ID
                module = crust.api.module.find(module)
              }

              if (!(module instanceof Module)) {
                throw Error('Expecting Module object')
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
              $crm.notificationEmailSend({
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
              error: (text) => this.raiseErrorAlert(text),
            },
          },
        },
      }

      return {
        ...ctx,
        crust,
      }
    },
  },
}
