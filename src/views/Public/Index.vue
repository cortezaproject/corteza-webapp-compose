<template>
  <div class="centering-wrap inactive-area">
    <public-header :currentPageID="pageID" @toggleNav="navVisible = $event"></public-header>
    <router-view :class="`crm-content ${navVisible && canPushContent ? 'padded' : ''}`" />
  </div>
</template>

<script>
import PublicHeader from '@/components/Public/Header'

const pushContentAbove = 610

export default {
  name: 'public-root',

  data () {
    return {
      navVisible: false,
      documentWidth: 0,
    }
  },

  computed: {
    canPushContent () {
      return this.documentWidth > pushContentAbove
    },
  },

  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

  created () {
    this.documentWidth = document.body.offsetWidth
    window.onresize = () => {
      this.documentWidth = document.body.offsetWidth
    }
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
    padding-left: 250px;
  }
}

</style>
