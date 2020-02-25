<template>
  <div :class="[inEditing ? 'edit': 'view']">
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
      :mode="blockMode"
      @reload="loadRecord()"
    />
    <toolbar :back-link="{name: 'pages'}"
             :hide-delete="!module.canDeleteRecord || isDeleted"
             :read-only="!module.canUpdateRecord || isDeleted"
             @delete="handleDelete"
             @save="handleUpdate()">

      <b-button v-if="module.canCreateRecord"
          variant="outline-secondary ml-1"
          @click.prevent="$router.push({ name: 'page.record.create', params: { pageID: page.pageID, values: record.values }})" >{{ $t('general.label.clone') }}</b-button>

      <b-button
        v-if="module.canCreateRecord"
        variant="outline-secondary ml-1"
        @click.prevent="$router.push({ name: 'page.record.create', params: $route.params })"
      >
        + {{ $t('general.label.addNew') }}
      </b-button>

      <b-button
        v-if="!isDeleted && !inEditing && module.canUpdateRecord"
        variant="outline-secondary ml-1"
        @click.prevent="$router.push({ name: 'page.record.edit', params: $route.params })"
      >
        {{ $t('general.label.edit') }}
      </b-button>

      <b-button
        v-if="module.canUpdateRecord && inEditing"
        :disabled="!isValid"
        @click.prevent="handleFormSubmit"
        class="float-right ml-1"
        variant="primary"
      >
        {{ $t('general.label.save') }}
      </b-button>
    </toolbar>
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
import Toolbar from 'corteza-webapp-compose/src/components/Public/Page/Toolbar'
import { compose, validator, NoID } from '@cortezaproject/corteza-js'

export default {
  name: 'ViewRecord',

  components: {
    Grid,
    Toolbar,
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

      // We handle edit mode here because EditRecord components
      // is extending us
      blockMode: 'base',
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
