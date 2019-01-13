import Record from '@/lib/record'
import Module from '@/lib/module'
import Messaging from '@/api/messaging'

export default {
  methods: {
    createRecord (module, record) {
      let ctx = { module, record }

      if (this.runTriggers('beforeCreate', ctx)) {
        this.$crm.moduleRecordCreate(this.record).then((r) => {
          this.record = new Record(this.page.module, r)
          this.raiseSuccessAlert('Record saved')
          this.$router.push({ name: 'public.page.record.edit', params: { recordID: this.record.recordID } })

          this.runTriggers('afterCreate', ctx)
        }).catch(this.defaultErrorHandler('Could not save this record'))
      }
    },

    updateRecord (module, record) {
      let ctx = { module, record }

      if (this.runTriggers('beforeUpdate', ctx)) {
        this.$crm.moduleRecordEdit(this.record).then((r) => {
          this.record = new Record(this.page.module, r)
          this.raiseSuccessAlert('Record saved')
          this.$router.push({ name: 'public.page.record' })

          this.runTriggers('afterUpdate', ctx)
        }).catch(this.defaultErrorHandler('Could not update this record'))
      }
    },

    deleteRecord (module, record) {
      let ctx = { module, record }

      if (this.runTriggers('beforeDelete', ctx)) {
        this.$crm.moduleRecordDelete({ moduleID: this.record.moduleID, recordID: this.record.recordID }).then(rsp => {
          this.raiseSuccessAlert('Record deleted')
          this.$router.push({ name: 'public.page' })

          this.runTriggers('afterDelete', ctx)
        }).catch(this.defaultErrorHandler('Could not delete this record'))
      }
    },

    async runTrigger (triggerID, module, record) {
      let ctx = { module, record }

      const trigger = (await this.getTriggers()).find(t => t.triggerID === triggerID)

      if (trigger !== undefined && trigger.enabled) {
        trigger.run(this.triggerContext({ ...ctx, action: 'manual' }))
      }
    },

    async getTriggers () {
      return this.$store.dispatch('trigger/load')
    },

    async runTriggers (action, ctx) {
      ctx = this.triggerContext({ ...ctx, action })

      const set = (await this.getTriggers()).filter(t => t.runnable({ module, action }))

      for (let i = 0; i < set.length; i++) {
        if (!set[i].run(ctx)) {
          return false
        }
      }

      return true
    },

    triggerContext (ctx) {
      const $crm = this.$crm
      let { module } = ctx

      ctx.modules = [ module ]

      return {
        ...ctx,

        crust: {
          api: {
            record: {
              async save (record) {
                if (!(record instanceof Record)) {
                  throw Error('Expecting Record object')
                }

                if (record.recordID === '') {
                  record = await $crm.moduleRecordCreate(record)
                } else {
                  record = await $crm.moduleRecordEdit(record)
                }

                return record
              },

              async delete (record) {
                if (!(record instanceof Record)) {
                  throw Error('Expecting Record object')
                }

                if (record.recordID !== '') {
                  const result = await $crm.moduleRecordDelete(record)
                  return result
                }
              },
            },
          },

          helpers: {
            record: {
              new: (module, values = {}) => {
                if (typeof module === 'string') {
                  // Find from list of modules by name or ID
                  module = (ctx.modules || []).find(m => m.name === module || m.moduleID === module)
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
                console.log({ channelID, message })
                Messaging.messageCreate({ channelID, message })
              },
            },

            ui: {
              alert: {
                success: (text) => this.raiseSuccessAlert(text),
                error: (text) => this.raiseErrorAlert(text),
              },
            },
          },
        },
      }
    },
  },
}
