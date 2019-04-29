<template>
  <div class="centering-wrap inactive-area">
    <public-header :currentPageID="pageID" @toggleNav="navVisible = $event"></public-header>
    <router-view :class="`compose-content ${navVisible && canPushContent ? 'padded' : ''}`" />
  </div>
</template>

<script>
import PublicHeader from '@/components/Public/Header'

const pushContentAbove = 610

export default {
  name: 'public-root',

  components: {
    PublicHeader,
  },

  props: {
    pageID: {
      type: String,
      required: true,
    },
  },

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

  created () {
    this.documentWidth = document.body.offsetWidth
    window.onresize = () => {
      this.documentWidth = document.body.offsetWidth
    }
  },
}
</script>

<style lang="scss">
.compose-content {
  padding-left: 0;
  transition: padding-left 0.3s;

  &.padded {
    padding-left: 250px;
  }
}

</style>
