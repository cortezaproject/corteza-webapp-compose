<template>
  <div v-if="!!page">
    <router-view :namespace="namespace"
                 :page="page"
                 v-if="recordID || createPage" />

    <grid :namespace="namespace"
          :page="page" v-else />

    <attachment-modal />
  </div>
  <div v-else><!-- @todo loader --></div>
</template>
<script>
import Grid from 'corteza-webapp-compose/src/components/Public/Page/Grid'
import AttachmentModal from 'corteza-webapp-compose/src/components/Public/Page/Attachment/Modal'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'
import Page from 'corteza-webapp-compose/src/lib/page'

export default {
  components: {
    Grid,
    AttachmentModal,
  },

  props: {
    namespace: { // via router-view
      type: Namespace,
      required: true,
    },

    page: { // via route-view
      type: Page,
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
