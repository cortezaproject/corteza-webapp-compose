<template>
  <div v-if="!!page" class="d-flex">
    <router-view :namespace="namespace"
                 :page="page"
                 class="flex-grow-1"
                 v-if="recordID || createPage" />

    <grid :namespace="namespace"
          class="vh-100 flex-grow-1"
          :page="page" v-else />

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
    createPage () {
      return this.$route.name === 'page.record.create'
    },
  },
}
</script>
