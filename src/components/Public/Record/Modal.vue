<template>
  <b-modal
    id="record-modal"
    v-model="showRecordModal"
    scrollable
    body-class="p-0"
    footer-class="p-0"
    size="xl"
  >
    <template #modal-title>
      <portal-target
        name="record-modal-header"
      />
    </template>

    <view-record
      :namespace="namespace"
      :page="page"
      :module="module"
      :record-i-d="recordID"
      :show-record-modal="showRecordModal"
    />

    <template #modal-footer>
      <portal-target
        name="record-modal-footer"
        class="w-100 m-0"
      />
    </template>
  </b-modal>
</template>

<script>
import record from 'corteza-webapp-compose/src/mixins/record'
import { compose, NoID } from '@cortezaproject/corteza-js'
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

    pageTitle () {
      if (this.page.pageID !== NoID) {
        const { title = '', handle = '' } = this.page
        return title || handle || this.$t('navigation:noPageTitle')
      }

      return ''
    },
  },

  created () {
    this.$root.$on('show-record-modal', this.showModal)
  },

  beforeDestroy () {
    this.$root.$off('show-record-modal')
  },

  methods: {
    showModal (e) {
      const { recordID, moduleID, recordPageID } = e
      this.showRecordModal = true
      this.recordID = recordID
      this.page = this.pages.find(p => p.pageID === recordPageID)
      this.module = this.getModuleByID(moduleID)
    },
  },
}

</script>

<style>
#record-modal .modal-dialog {
  height: 100%;
  max-width: 90vw;
}

#record-modal .modal-content {
  height: 100%;
}
</style>
