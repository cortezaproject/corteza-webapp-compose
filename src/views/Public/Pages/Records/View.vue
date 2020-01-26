<template>
  <div :class="[editMode ? 'edit': 'view']">
    <b-alert v-if="isDeleted"
             show
             variant="info">

      {{ $t('block.record.recordDeleted') }}
    </b-alert>

    <grid
      v-if="record"
      v-bind="$props"
      :errors="errors"
      :edit-mode="editMode"
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

      <b-button v-if="module.canCreateRecord"
                variant="outline-secondary ml-1"
                @click.prevent="$router.push({ name: 'page.record.create', params: $route.params })">+ {{ $t('general.label.addNew') }}</b-button>

      <b-button v-if="!isDeleted && !editMode && module.canUpdateRecord"
                variant="outline-secondary ml-1"
                @click.prevent="$router.push({ name: 'page.record.edit', params: $route.params })" >{{ $t('general.label.edit') }}</b-button>

      <b-button v-if="module.canUpdateRecord && editMode"
                :disabled="isValid"
                @click.prevent="handleUpdate"
                class="float-right ml-1"
                variant="primary"
              >{{ $t('general.label.save') }}</b-button>
    </toolbar>
    <b-modal size="lg" id="deleteRecord" :title="$t('block.record.deleteRecord')" @ok="handleDelete" :ok-title="$t('general.label.delete')" ok-variant="danger">
      <div class="d-block text-center">
        <h3>{{ $t('block.record.confirmDelete') }}</h3>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import { compose } from '@cortezaproject/corteza-js'
import uiScriptRunner from 'corteza-webapp-compose/src/mixins/ui-script-runner'
import Toolbar from 'corteza-webapp-compose/src/components/Public/Page/Toolbar'

export default {
  name: 'ViewRecord',

  components: {
    Grid,
    Toolbar,
  },

  mixins: [
    uiScriptRunner,
  ],

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
      record: undefined,

      // We handle edit mode here because EditRecord components
      // is extending us
      editMode: false,
    }
  },

  computed: {
    validator () {
      return this.module ? new compose.RecordValidator(this.module) : null
    },

    isValid () {
      if (this.validator && this.record) {
        // @todo do something with errors
        return this.validator.run(this.record).valid()
      }

      return true
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
  },

  methods: {
    loadRecord () {
      this.record = null
      if (this.page && this.recordID && this.page.moduleID) {
        const { namespaceID, moduleID } = this.page
        this.$ComposeAPI.recordRead({ namespaceID, moduleID, recordID: this.recordID }).then(record => {
          this.record = new compose.Record(this.module, record)
        }).catch(this.defaultErrorHandler(this.$t('notification.record.loadFailed')))
      }
    },

    /**
     * On delete, preserve user's view. Show a notification that the record
     * has been deleted.
     */
    handleDelete () {
      this.deleteRecord(this.namespace, this.module, this.record)
        .then((e) => {
          this.record.deletedAt = (new Date()).toISOString()
        })
        .catch(this.defaultErrorHandler(this.$t('notification.record.deleteFailed')))
    },

    handleBack () {
      this.$router.back()
    },
  },
}
</script>
