<template>
  <div class="view" v-if="blocks">
    <grid :blocks="blocks" :editable="false">
      <template slot-scope="{ block, index }">
        <block-editor :block="block" :record="record" v-if="editMode" />
        <block-viewer :block="block" :record="record" v-else />
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

  // watch: {
  //   pageID () {
  //     this.loadPage()
  //   },
  //
  //   recordID () {
  //     this.loadRecord()
  //   },
  //
  //   page () {
  //     this.loadRecord()
  //   },
  // },
  //
  // mounted () {
  //   this.loadPage()
  // },

  // methods: {
  //   loadPage () {
  //     this.page = null
  //     this.record = null
  //
  //     this.$crm.pageRead({ pageID: this.pageID }).then(page => {
  //       this.page = page
  //     })
  //   },
  //
  //   loadRecord () {
  //     this.record = null
  //     if (this.page && this.recordID && this.page.moduleID) {
  //       this.$crm.moduleContentRead({ moduleID: this.page.moduleID, contentID: this.recordID }).then(record => {
  //         this.record = record
  //       })
  //     }
  //   },
  // },

  components: {
    Grid,
    BlockViewer,
    BlockEditor,
  },
}
</script>
