<template>
  <grid
    v-if="page.blocks"
    :blocks="page.blocks"
    :editable="false"
    :key="page.pageID"
  >
    <template
      slot-scope="{ boundingRect, block }"
    >
      <component
        :is="editMode ? 'block-editor' : 'block-viewer'"
        :namespace="namespace"
        :module="module"
        :record="record"
        :page="page"
        :block="block"
        :bounding-rect="boundingRect"
        v-on="$listeners"
      />
    </template>
  </grid>
</template>
<script>
import Grid from '../../Common/Grid'
import BlockViewer from '../../PageBlocks/View'
import BlockEditor from '../../PageBlocks/Edit'
import { compose } from '@cortezaproject/corteza-js'

export default {
  name: 'public-grid',

  components: {
    Grid,
    BlockViewer,
    BlockEditor,
  },

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

    record: {
      type: compose.Record,
      required: false,
    },

    editMode: {
      type: Boolean,
    },
  },
}
</script>
