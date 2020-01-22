<template>
  <grid v-if="page.blocks"
        :blocks="page.blocks"
        :editable="false"
        :key="page.pageID">
    <template slot-scope="{ boundingRect, block }">
      <block-editor :block="block"
                    :namespace="namespace"
                    :page="page"
                    :module="module"
                    :record="record"
                    :bounding-rect="boundingRect"
                    v-on="$listeners"
                    v-if="editMode" />
      <block-viewer :block="block"
                    :namespace="namespace"
                    :page="page"
                    :module="module"
                    :record="record"
                    :bounding-rect="boundingRect"
                    v-on="$listeners"
                    v-else />
    </template>
  </grid>
</template>
<script>
import Grid from 'corteza-webapp-compose/src/components/Common/Grid'
import BlockViewer from 'corteza-webapp-compose/src/lib/block/View'
import BlockEditor from 'corteza-webapp-compose/src/lib/block/Edit'

export default {
  name: 'public-grid',

  components: {
    Grid,
    BlockViewer,
    BlockEditor,
  },

  props: {
    namespace: {
      type: Object,
      required: true,
    },

    page: {
      type: Object,
      required: true,
    },

    record: {
      type: Object,
      required: false,
    },

    editMode: {
      type: Boolean,
    },
  },

  computed: {
    module () {
      if (this.page.moduleID) {
        return this.$store.getters['module/getByID'](this.page.moduleID)
      }

      return undefined
    },
  },
}
</script>
