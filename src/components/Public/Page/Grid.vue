<template>
  <div class="view" v-if="blocks">
    <grid :blocks="blocks" :editable="false">
      <template slot-scope="{ block, index }">
        <block-editor :block="block" :module="page.module" :record="record" v-if="editMode" />
        <block-viewer :block="block" :module="page.module" :record="record" v-else />
      </template>
    </grid>
  </div>
</template>
<script>
import Grid from '@/components/Common/Grid'
import BlockViewer from '@/lib/block/View'
import BlockEditor from '@/lib/block/Edit'
import Block from '@/lib/block'

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
    blocks () {
      return this.page && this.page.blocks && Array.isArray(this.page.blocks) ? this.page.blocks.map(b => new Block(b)) : []
    },
  },

  components: {
    Grid,
    BlockViewer,
    BlockEditor,
  },
}
</script>
