<template>
  <PageContent></PageContent>
</template>

<script>
/* eslint-disable-next-line */
import VueGridLayout from "vue-grid-layout";
import PageContent from '@/components/PageContent'
export default {
  name: 'PageView',
  components: {
    PageContent,
  },
  created () {
    this.$store.dispatch('pages/initViewPageData', this.$route.params.id)
  },
}
</script>
