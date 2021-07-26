<template>
  <div class="d-flex flex-grow-1 w-100">
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
      <record-toolbar
        :module="module"
        :record="record"
        :processing="processing"
        :processing-submit="processingSubmit"
        :processing-delete="processingDelete"
        :isDeleted="isDeleted"
        :inEditing="inEditing"
        :hideClone="inCreating"
        :hideAdd="inCreating"
        @add="handleAdd()"
        @clone="handleClone()"
        @edit="handleEdit()"
        @delete="handleDelete()"
        @back="handleBack()"
        @submit="handleFormSubmit('page.record')"
      />
    </portal>
  </div>
</template>
<script>
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import RecordToolbar from 'corteza-webapp-compose/src/components/Common/RecordToolbar'
import record from 'corteza-webapp-compose/src/mixins/record'
import { compose, NoID } from '@cortezaproject/corteza-js'

export default {
  name: 'ViewRecord',

  components: {
    Grid,
    RecordToolbar,
  },

  mixins: [
    // The record mixin contains all of the logic for creating/editing/deleting the record
    record,
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
      inEditing: false,
      inCreating: false,
    }
  },

  computed: {
    newRouteParams () {
      // Remove recordID and values from route params
      const { recordID, values, ...params } = this.$route.params
      return params
    },

    getUiEventResourceType () {
      return 'record-page'
    },
  },

  watch: {
    recordID: {
      immediate: true,
      handler () {
        this.record = undefined
        this.loadRecord()
      },
    },
  },

  methods: {
    async loadRecord () {
      if (this.page && this.recordID && this.recordID !== NoID && this.page.moduleID !== NoID) {
        const { namespaceID, moduleID } = this.page
        const module = Object.freeze(this.getModuleByID(moduleID).clone())
        await this.$ComposeAPI
          .recordRead({ namespaceID, moduleID, recordID: this.recordID })
          .then(record => {
            this.record = new compose.Record(module, record)
          })
          .catch(this.toastErrorHandler(this.$t('notification.record.loadFailed')))
      }
    },

    handleBack () {
      this.$router.back()
    },

    handleAdd () {
      this.$router.push({ name: 'page.record.create', params: this.newRouteParams })
    },

    handleClone () {
      this.$router.push({ name: 'page.record.create', params: { pageID: this.page.pageID, values: this.record.values } })
    },

    handleEdit () {
      this.$router.push({ name: 'page.record.edit', params: this.$route.params })
    },
  },
}
</script>
