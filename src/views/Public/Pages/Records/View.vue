<template>
  <div :class="[editMode ? 'edit': 'view']">
    <toolbar :back-link="{name: 'pages'}"
             :hide-delete="!module.canDeleteRecord"
             :read-only="!module.canUpdateRecord"
             @delete="handleDelete"
             @save="handleUpdate()">

      <b-button v-if="module.canCreateRecord"
                pill
                variant="outline-secondary mx-1"
                @click.prevent="$router.push({ name: 'page.record.create', params: $route.params })">+ {{ $t('general.label.addNew') }}</b-button>

      <b-button v-if="!editMode && module.canUpdateRecord"
                pill
                variant="outline-secondary"
                @click.prevent="$router.push({ name: 'page.record.edit', params: $route.params })" >{{ $t('general.label.edit') }}</b-button>

      <b-button v-if="module.canUpdateRecord && editMode"
                :disabled="!record || !record.isValid()"
                @click.prevent="handleUpdate"
                pill
                class="float-right"
                variant="primary"
              >{{ $t('general.label.save') }}</b-button>

    </toolbar>
    <grid :namespace="namespace"
          :page="page"
          :record="record"
          :edit-mode="editMode"
          v-if="record"
          @reload="loadRecord()" />
    <b-modal id="deleteRecord" :title="$t('block.record.deleteRecord')" @ok="handleDelete" :ok-title="$t('general.label.delete')" ok-variant="danger">
      <div class="d-block text-center">
        <h3>{{ $t('block.record.confirmDelete') }}</h3>
      </div>
    </b-modal>
  </div>
</template>
<script>
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'
import Record from 'corteza-webapp-compose/src/lib/record'
import triggerRunner from 'corteza-webapp-compose/src/mixins/trigger_runner'
import Toolbar from 'corteza-webapp-compose/src/components/Public/Page/Toolbar'
import Namespace from 'corteza-webapp-compose/src/lib/namespace'
import Page from 'corteza-webapp-compose/src/lib/page'

export default {
  name: 'ViewRecord',

  components: {
    Grid,
    ConfirmationToggle,
    Toolbar,
  },

  mixins: [
    triggerRunner,
  ],

  props: {
    namespace: { // via router-view
      type: Namespace,
      required: true,
    },

    page: { // via router-view
      type: Page,
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
    module () {
      if (this.page.moduleID) {
        return this.$store.getters['module/getByID'](this.page.moduleID)
      }
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
          this.record = new Record(this.module, record)
        }).catch(this.defaultErrorHandler(this.$t('notification.record.loadFailed')))
      }
    },

    handleDelete () {
      this.deleteRecord(this.namespace, this.module, this.record)
        .then(() => {
          this.$router.push({ name: 'page', params: { pageID: this.page.pageID } })
        })
        .catch(this.defaultErrorHandler(this.$t('notification.record.deleteFailed')))
    },

    handleBack () {
      this.$router.back()
    },
  },
}
</script>
