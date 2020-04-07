<template>
  <div class="d-flex flex-grow-1">
    <b-alert v-if="isDeleted"
             show
             variant="info">

      {{ $t('block.record.recordDeleted') }}
    </b-alert>
    <grid
      v-if="record"
      v-bind="$props"
      :errors="errors"
      :record="record"
      :mode="inEditing ? 'editor' : 'base'"
      @reload="loadRecord()"
    />

    <portal to="toolbar">
      <b-container
        fluid
        class="bg-white shadow border-top py-3 px-3 m-0"
      >
        <b-row
          no-gutters
        >
          <b-col cols="4">
            <b-button
              variant="link"
              @click.prevent="$router.back()"
            >
              &#171; {{ $t('general.label.back') }}
            </b-button>
          </b-col>
          <b-col
            cols="4"
            class="text-center"
          >
            <b-button
              v-if="module.canCreateRecord"
              variant="outline-secondary"
              class="m-1"
              @click.prevent="$router.push({ name: 'page.record.create', params: { pageID: page.pageID, values: record.values }})"
            >
              {{ $t('general.label.clone') }}
            </b-button>

            <b-button
              v-if="module.canCreateRecord"
              variant="outline-secondary"
              class="m-1"
              @click.prevent="$router.push({ name: 'page.record.create', params: newRouteParams })"
            >
              {{ $t('general.label.addNew') }}
            </b-button>
          </b-col>
          <b-col
            cols="4"
            class="text-right"
          >
            <c-input-confirm
              :disabled="!module.canDeleteRecord || isDeleted"
              @confirmed="handleDelete()"
              class="m-1"
            >
              {{ $t('general.label.delete') }}
            </c-input-confirm>

            <b-button
              v-if="module.canUpdateRecord && !isDeleted && !inEditing"
              variant="outline-secondary"
              class="m-1"
              @click.prevent="$router.push({ name: 'page.record.edit', params: $route.params })"
            >
              {{ $t('general.label.edit') }}
            </b-button>

            <b-button
              v-else-if="module.canUpdateRecord"
              :disabled="!isValid || isDeleted"
              class="m-1"
              variant="primary"
              @click.prevent="handleFormSubmit"
            >
              {{ $t('general.label.save') }}
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </portal>
    <b-modal size="lg" id="deleteRecord" :title="$t('block.record.deleteRecord')" @ok="handleDelete" :ok-title="$t('general.label.delete')" ok-variant="danger">
      <div class="d-block text-center">
        <h3>{{ $t('block.record.confirmDelete') }}</h3>
      </div>
    </b-modal>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import { compose, validator, NoID } from '@cortezaproject/corteza-js'

export default {
  name: 'ViewRecord',

  components: {
    Grid,
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    module: {
      type: compose.Module,
      required: false,
    },

    page: {
      type: compose.Page,
      required: true,
    },

    recordID: {
      type: String,
      required: false,
    },
  },

  data () {
    return {
      inEditing: false,
      record: undefined,
      errors: new validator.Validated(),
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
    }),

    newRouteParams () {
      const { recordID, ...params } = this.$route.params
      return params
    },

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
    recordID: {
      immediate: true,
      handler () {
        this.loadRecord()
      },
    },
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
    loadRecord () {
      this.record = null
      if (this.page && this.recordID && this.page.moduleID) {
        const { namespaceID, moduleID } = this.page
        const module = Object.freeze(this.getModuleByID(moduleID).clone())
        this.$ComposeAPI
          .recordRead({ namespaceID, moduleID, recordID: this.recordID })
          .then(record => {
            this.record = new compose.Record(module, record)
          })
          .catch(this.defaultErrorHandler(this.$t('notification.record.loadFailed')))
      }
    },

    handleBack () {
      this.$router.back()
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
    handleFormSubmit (ev) {
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
          this.$router.push({ name: 'page.record', params: { ...this.$route.params, recordID: this.record.recordID } })
        })
        .catch(this.defaultErrorHandler(this.$t(
          isNew
            ? 'notification.record.createFailed'
            : 'notification.record.updateFailed',
        )))
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
     * Generic event dispatcher for ui:compose:record-page resource type
     *
     * This is used when deleting, updating, creating
     * records and where validation errors occur
     *
     * @param eventType
     */
    dispatchUiEvent (eventType) {
      const resourceType = 'ui:compose:record-page'

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
</script>
