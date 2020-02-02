<template>
  <div v-if="!!page" class="d-flex">
    <router-view
      class="flex-grow-1"
      v-if="recordID || isRecordCreatePage"
      :namespace="namespace"
      :module="module"
      :page="page"
    />

    <grid
      class="vh-100 flex-grow-1"
      v-else
      :namespace="namespace"
      :module="module"
      :page="page"
    />

    <right-panel class="pb-5"
                 :namespaceID="namespace.namespaceID"/>

    <attachment-modal />
  </div>
  <div v-else><!-- @todo loader --></div>
</template>
<script>
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import AttachmentModal from 'corteza-webapp-compose/src/components/Public/Page/Attachment/Modal'
import { compose } from '@cortezaproject/corteza-js'
import RightPanel from 'corteza-webapp-compose/src/components/RightPanel'

export default {
  components: {
    Grid,
    AttachmentModal,
    RightPanel,
  },

  props: {
    namespace: { // via router-view
      type: compose.Namespace,
      required: true,
    },

    page: { // via route-view
      type: compose.Page,
      required: true,
    },

    // We're using recordID to check if we need to display router-view or grid component
    recordID: String,
  },

  computed: {
    isRecordCreatePage () {
      return this.$route.name === 'page.record.create'
    },

    module () {
      if (this.page.moduleID) {
        return this.$store.getters['module/getByID'](this.page.moduleID)
      }

      return undefined
    },
  },
}
</script>
