<template>
  <grid v-if="page.blocks"
        :blocks="page.blocks"
        :editable="false"
        :key="page.pageID">
    <template slot-scope="{ boundingRect, block, index }">
      <block-editor :block="block" :page="page" :module="module" :record="record" v-on="$listeners" :bounding-rect="boundingRect" v-if="editMode" />
      <block-viewer :block="block" :page="page" :module="module" :record="record" v-on="$listeners" :bounding-rect="boundingRect" v-else />
    </template>
  </grid>
</template>
<script>
import Grid from '@/components/Common/Grid'
import BlockViewer from '@/lib/block/View'
import BlockEditor from '@/lib/block/Edit'

export default {
  name: 'public-grid',

  props: {
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
    },
  },

  components: {
    Grid,
    BlockViewer,
    BlockEditor,
  },
}
</script>
