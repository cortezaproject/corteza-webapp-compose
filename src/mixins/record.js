// This mixin is used on View component of Records.

import { compose, validator, NoID } from '@cortezaproject/corteza-js'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      inEditing: false,
      record: null,
      errors: new validator.Validated(),
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    validator () {
      if (!this.module) {
        throw new Error('can not initialize record validator without module')
      }

      return new compose.RecordValidator(this.module)
    },

    isValid () {
      return this.errors.valid()
    },

    /**
     * Tells if given record is deleted; If record not provided, returns undefined
     * @returns {Boolean|undefined}
     */
    isDeleted () {
      if (!this.record) {
        return
      }
      return !!this.record.deletedAt
    },
  },

  methods: {
    /**
     * Handle form submit for record create & update
     *
     *  -> dispatch beforeFormSubmit (on ui:compose:record-page)
     *  -> validate record (see validateRecord())
     *     -> stop on errors
     *  -> send record to the API
     *  -> apply changes received from the API to current record
     *  -> dispatch afterFormSubmit
     *  -> redirect user to record viewer page
     *
     * @returns {Promise<void>}
     */
    async handleFormSubmit (route = 'page.record') {
      const isNew = this.record.recordID === NoID
      const queue = []

      // Collect records from all record lines
      this.page.blocks.forEach((b, index) => {
        if (b.kind === 'RecordLines') {
          const p = new Promise((resolve, reject) => {
            this.$root.$emit(`record-line:collect:${index}`, resolve)
          })

          queue.push(p)
        }
      })
      const pairs = await Promise.all(queue)

      // Construct batch record payload
      const records = pairs.reduce((acc, cur) => {
        acc.push({
          refField: cur.refField,
          set: cur.records,
          module: cur.module,
        })
        return acc
      }, [])

      // Append after the payload construction, so it is not presented as a
      // sub record.
      pairs.push({
        module: this.module,
        records: [this.record],
      })

      return this
        .dispatchUiEvent('beforeFormSubmit', this.record, { $records: records })
        .then(() => this.validateRecord(pairs))
        .then(() => {
          if (isNew) {
            return this.$ComposeAPI.recordCreate({ ...this.record, records })
          } else {
            return this.$ComposeAPI.recordUpdate({ ...this.record, records })
          }
        })
        .catch(err => {
          const { details = undefined } = err
          if (!!details && Array.isArray(details) && details.length > 0) {
            this.errors.push(...details)
            throw new Error(this.$t('notification.record.validationErrors'))
          }

          throw err
        })
        .then((record) => this.record.apply(record))
        .then(() => this.dispatchUiEvent('afterFormSubmit', this.record, { $records: records }))
        .then(() => {
          this.$router.push({ name: route, params: { ...this.$route.params, recordID: this.record.recordID } })
        })
        .catch(this.defaultErrorHandler(this.$t(
          isNew
            ? 'notification.record.createFailed'
            : 'notification.record.updateFailed',
        )))
    },

    /**
     * On delete, preserve user's view. Show a notification that the record
     * has been deleted.
     */
    handleDelete () {
      return this
        .dispatchUiEvent('beforeDelete')
        .then(() => this.$ComposeAPI.recordDelete(this.record))
        .then(() => {
          this.record.deletedAt = (new Date()).toISOString()
        })
        .then(() => this.dispatchUiEvent('afterDelete'))
        .catch(this.defaultErrorHandler(this.$t('notification.record.deleteFailed')))
    },

    /**
     * Validates record and dispatches onFormSubmitError
     *
     * onFormSubmitError is dispatched only if there are record errors,
     * if not, we continue with form submit handling
     *
     * After onFormSubmitError, record is re-validated and if errors
     * are still present, we stop form submit handing
     *
     * @returns {Promise<void>}
     */
    async validateRecord (pairs) {
      // Cache validators for later use
      const validators = {}
      for (const p of pairs) {
        validators[p.module.resourceID] = validators[p.module.resourceID] || new compose.RecordValidator(p.module)
      }

      const vRunner = () => {
        // Reset errors
        this.errors = new validator.Validated()

        // validate
        for (const p of pairs) {
          const v = validators[p.module.resourceID]
          const errs = new validator.Validated()
          p.records.forEach((r, i) => {
            const err = v.run(r)
            if (!err.valid()) {
              err.applyMeta({ resource: p.module.resourceID, item: i })
              errs.push(...err.set)
            }
          })
          this.errors.push(...errs.set)
        }
      }

      vRunner()
      if (this.errors.valid()) {
        return
      }

      await this.dispatchUiEvent('onFormSubmitError')
      vRunner()
      if (!this.errors.valid()) {
        throw new Error(this.$t('notification.record.validationErrors'))
      }
    },

    /**
     * Returns errors, filtered for a specific field
     * @param name
     * @returns {validator.Validated} filtered validation results
     */
    fieldErrors (name) {
      if (!this.errors) {
        return new validator.Validated()
      }

      return this.errors.filterByMeta('field', name)
    },

    /**
     * Generic event dispatcher for ui:compose:record-page resource type
     *
     * This is used when deleting, updating, creating
     * records and where validation errors occur
     *
     * @param eventType
     */
    dispatchUiEvent (eventType, record = this.record, args = {}) {
      const resourceType = `ui:compose:${this.getUiEventResourceType || 'record-page'}`

      const argsBase = {
        errors: this.errors,
        validator: this.validator,
        ...args,
      }

      return this
        .$EventBus
        .Dispatch(compose.RecordEvent(
          record, { eventType, resourceType, args: argsBase }))
    },
  },
}
