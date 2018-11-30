<template>
  <div class="view">
    <grid :page="page"/>
  </div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'

export default {
  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      page: {},
    }
  },

  watch: {
    pageID () {
      this.loadPage()
    },
  },

  mounted () {
    this.loadPage()
  },

  methods: {
    loadPage () {
      this.page = {}
      this.$crm.pageRead({ pageID: this.pageID }).then(page => {
        this.page = page
        this.loadRecord()
      })
    },

    loadRecord () {}, // Placeholder, *Record components will override this
  },

  components: {
    Grid,
  },
}
</script>
