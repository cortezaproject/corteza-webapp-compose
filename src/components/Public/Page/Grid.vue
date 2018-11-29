<template>
  <div class="view" v-if="blocks">
    <grid :blocks="blocks" :editable="false">
      <template slot-scope="{ block, index }">
        <block-viewer :block="block" :record="record" />
      </template>
    </grid>
  </div>
</template>
<script>
import Grid from '@/components/Common/Grid'
import BlockViewer from '@/lib/block/View'
import Block from '@/lib/block'

export default {
  name: 'public-grid',

  props: {
    pageID: {
      type: String,
      required: true,
    },

    recordID: {
      type: String,
      required: false,
    },
  },

  computed: {
    blocks () {
      return this.page ? this.page.blocks.map(b => new Block(b)) : []
    },
  },

  data () {
    return {
      page: null,
      record: null,
    }
  },

  watch: {
    pageID () {
      this.loadPage()
    },

    recordID () {
      this.loadRecord()
    },

    page () {
      this.loadRecord()
    },
  },

  mounted () {
    this.loadPage()
  },

  methods: {
    loadPage () {
      this.page = null
      this.record = null

      this.$crm.pageRead({ pageID: this.pageID }).then(page => {
        this.page = page
      })
    },

    loadRecord () {
      this.record = null
      if (this.page && this.recordID && this.page.moduleID) {
        this.$crm.moduleContentRead({ moduleID: this.page.moduleID, contentID: this.recordID }).then(record => {
          this.record = record
        })
      }
    },
  },

  components: {
    Grid,
    BlockViewer,
  },
}
</script>
