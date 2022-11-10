<template>
  <b-modal
    id="record-modal"
    v-model="showRecordModal"
    body-class="p-0"
    size="xl"
  >
    <template #modal-title>
      <portal-target name="record-modal-header" />
    </template>
    <view-record
      :namespace="namespace"
      :page="page"
      :module="module"
      :record-i-d="recordID"
      :show-record-modal="showRecordModal"
    />
    <template #modal-footer>
      <portal-target name="record-modal-footer" />
    </template>
  </b-modal>
</template>

<script>
import record from 'corteza-webapp-compose/src/mixins/record'
import { compose } from '@cortezaproject/corteza-js'
import ViewRecord from 'corteza-webapp-compose/src/views/Public/Pages/Records/View'
import { mapGetters } from 'vuex'

export default {
  i18nOptions: {
    namespaces: 'block',
  },

  name: 'RecordModal',

  components: {
    ViewRecord,
  },

  mixins: [
    record,
  ],

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },
  },

  data () {
    return {
      showRecordModal: false,
      recordID: null,
      module: null,
      page: null,
    }
  },

  computed: {
    ...mapGetters({
      getModuleByID: 'module/getByID',
      pages: 'page/set',
    }),
  },

  created () {
    this.$root.$on('showRecordModal', this.showModal)
  },

  beforeDestroy () {
    this.$root.$off('showRecordModal', this.showModal)
  },

  methods: {
    showModal (e) {
      const { recordID, moduleID, recordPageID, showRecordModal } = e
      if (showRecordModal) {
        this.showRecordModal = true
        this.recordID = recordID
        this.module = module
        this.page = this.pages.find(p => p.pageID === recordPageID)
        this.module = this.getModuleByID(moduleID)
      }
    },
  },
}

</script>

<style>
#record-modal .modal-dialog {
  height: 100%;
}

#record-modal .modal-content {
  height: 100%;
}
</style>
