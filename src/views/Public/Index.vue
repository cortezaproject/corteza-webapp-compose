<template>
  <div class="centering-wrap inactive-area">
    <public-header :currentPageID="pageID"></public-header>
    <router-view/>
  </div>
</template>

<script>
import PublicHeader from '@/components/Public/Header'
export default {
  name: 'public-root',

  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

  components: {
    PublicHeader,
  },
}
</script>
