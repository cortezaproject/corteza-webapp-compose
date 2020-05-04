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

  watch: {
    'record.values': {
      deep: true,
      handler () {
        if (!this.errors.valid()) {
          this.errors = this.validator.run(this.record)
        }
      },
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
    handleFormSubmit (route = 'page.record') {
      const isNew = this.record.recordID === NoID

      return this
        .dispatchUiEvent('beforeFormSubmit')
        .then(() => this.validateRecord())
        .then(() => {
          if (isNew) {
            return this.$ComposeAPI.recordCreate(this.record)
          } else {
            return this.$ComposeAPI.recordUpdate(this.record)
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
        .then(() => this.dispatchUiEvent('afterFormSubmit'))
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
    async validateRecord () {
      this.errors = this.validator.run(this.record)
      if (this.errors.valid()) {
        return
      }

      await this.dispatchUiEvent('onFormSubmitError')

      this.errors = this.validator.run(this.record)
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
    dispatchUiEvent (eventType) {
      const resourceType = `ui:compose:${this.getUiEventResourceType || 'record-page'}`

      const args = {
        errors: this.errors,
        validator: this.validator,
      }

      return this
        .$EventBus
        .Dispatch(compose.RecordEvent(
          this.record, { eventType, resourceType, args }))
    },
  },
}
