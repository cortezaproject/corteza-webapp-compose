<template>
  <div class="view">
    <router-view :page="page" v-if="recordID || $route.meta.newRecord" />
    <grid :page="page" v-else />
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

    // We're using recordID to check if we need to display router-view or grid component
    recordID: String,
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
      })
    },
  },

  components: {
    Grid,
  },
}
</script>
