<template>
  <div class="view" v-if="page">
    <grid :blocks="page.blocks" :editable="false">
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
  props: {
    pageID: {
      type: String,
      required: true,
    },
    recordID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      page: null,
      record: null,
    }
  },

  computed: {
    blocks () {
      return this.page.blocks.map(b => new Block(b))
    },
  },

  watch: {
    pageID () {
      this.reload()
    },

    recordID () {
      this.reload()
    },
  },

  mounted () {
    this.reload()
  },

  methods: {
    reload () {
      this.loadPage().then(() => { this.loadRecord() })
    },

    async loadPage () {
      if (this.page && this.pageID === this.page.pageID) {
        // Already on the right page, return empty promise
        return new Promise((resolve) => { resolve() })
      }

      this.record = null
      this.page = null
      return this.$crm.pageRead({ pageID: this.pageID }).then(page => {
        this.page = page
      })
    },

    async loadRecord () {
      this.record = null
      if (this.page && this.recordID && this.page.moduleID) {
        return this.$crm.moduleContentRead({ moduleID: this.page.moduleID, contentID: this.recordID }).then(record => {
          this.record = record
        })
      }

      return new Promise((resolve) => { resolve() })
    },
  },

  components: {
    Grid,
    BlockViewer,
  },
}
</script>
