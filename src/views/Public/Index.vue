<template>
  <div class="centering-wrap inactive-area">
    <public-header :currentPageID="pageID" @toggleNav="navVisible = $event"></public-header>
    <router-view :class="`crm-content ${navVisible ? 'padded' : ''}`" />
  </div>
</template>

<script>
import PublicHeader from '@/components/Public/Header'
export default {
  name: 'public-root',

  data () {
    return {
      navVisible: false,
    }
  },

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

<style lang="scss">
.crm-content {
  padding-left: 0;
  transition: padding-left 0.3s;

  &.padded {
    padding-left: 200px;
  }
}

</style>
