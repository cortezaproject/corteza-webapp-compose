<template>
  <div v-if="!!page" class="scrollable">
    <router-view :namespace="namespace"
                 :page="page"
                 v-if="recordID || $route.meta.newRecord" />

    <grid :namespace="namespace"
          :page="page" v-else />

    <attachment-modal />
  </div>
  <div v-else><!-- @todo loader --></div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'
import AttachmentModal from '@/components/Public/Page/Attachment/Modal'
import Namespace from '@/lib/namespace'
import Page from '@/lib/page'

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
}
</script>
