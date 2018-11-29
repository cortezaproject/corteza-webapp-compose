<template>
  <div class="view">
    <grid :blocks.sync="blocks" :editable="false">
      <template slot-scope="{ block, index }">
        <block-viewer :block="block" />
      </template>
    </grid>
  </div>
</template>

<script>
import Grid from '@/components/Common/Grid'
import BlockViewer from '@/lib/block/View'
import Block from '@/lib/block'

export default {
  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

  components: {
    Grid,
    BlockViewer,
  },

  data () {
    return {
      blocks: [],
      loaded: true,
    }
  },

  mounted () {
    this.$crm.pageRead({ pageID: this.pageID }).then(page => {
      if (page.blocks && Array.isArray(page.blocks)) {
        this.blocks = page.blocks.map(b => new Block(b))
      }
    })
  },
}
</script>
