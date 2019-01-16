<template>
  <div v-if="!!page">
    <router-view :page="page" v-if="recordID || $route.meta.newRecord" />
    <grid :page="page" v-else />
  </div>
  <div v-else><!-- @todo loader --></div>
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

  computed: {
    page () {
      return this.$store.getters['page/getByID'](this.pageID)
    },
  },

  components: {
    Grid,
  },
}
</script>
