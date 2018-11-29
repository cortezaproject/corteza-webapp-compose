<template>
  <div class="view">
    <grid :blocks.sync="blocks" :editable="false">
      <template slot-scope="{ block, index }">
        <BlockComp :block="block"></BlockComp>
      </template>
    </grid>
  </div>
</template>

<script>
import NewBlockSelector from '@/components/Admin/Page/Builder/Selector'
import Editor from '@/components/Admin/Page/Builder/Editor'
import Grid from '@/components/Common/Grid'
import Block from '@/lib/block'
import BlockComp from '@/components/block/Block'

export default {
  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

  components: {
    Grid,
    NewBlockSelector,
    Editor,
    BlockComp,
  },

  data () {
    return {
      createBlock: null,
      // Block that is opened in editor
      updateBlock: null,
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
<style lang="scss" scoped>

</style>
