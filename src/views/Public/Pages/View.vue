<template>
  <div class="view" v-if="!!page">
    <router-view :page="page" v-if="recordID || $route.meta.newRecord" />
    <grid :page="page" v-else />
  </div>
  <div class="view" v-else><!-- @todo loader --></div>
</template>
<script>
import Grid from '@/components/Public/Page/Grid'
import Field from '@/lib/field'
import Module from '@/lib/module'

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
      page: null,
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
      this.page = null
      this.$crm.pageRead({ pageID: this.pageID }).then(page => {
        this.page = page

        this.page.module.fields = this.page.module.fields.map(f => new Field(f))
        this.page.module = new Module(this.page.module)
      })
    },
  },

  components: {
    Grid,
  },
}
</script>
