<template>
  <div class="centering-wrap inactive-area">
    <public-header :page="page"
                   :namespace="namespace"
                   @toggleNav="navVisible = $event" />
    <router-view :namespace="namespace"
                 :page="page"
                 :class="routerViewClass" />
  </div>
</template>

<script>
import PublicHeader from '@/components/Public/Header'
import Namespace from '@/lib/namespace'
import Page from '@/lib/page'

const pushContentAbove = 610

export default {
  name: 'public-root',

  components: {
    PublicHeader,
  },

  props: {
    pageID: {
      type: String,
      required: false,
      default: '',
    },

    namespace: { // via router-view
      type: Namespace,
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
    routerViewClass () {
      return {
        'compose-content': true,
        'padded': this.navVisible && this.canPushContent,
      }
    },

    canPushContent () {
      return this.documentWidth > pushContentAbove
    },

    page () {
      return this.$store.getters['page/getByID'](this.pageID) || new Page()
    },
  },

  created () {
    this.documentWidth = document.body.offsetWidth
    window.onresize = () => {
      this.documentWidth = document.body.offsetWidth
    }
  },

  beforeMount () {
    if (!this.pageID) {
      let { pageID } = this.$store.getters['page/firstVisibleNonRecordPage'] || {}
      if (pageID) {
        this.$router.push({ name: 'page', params: { pageID } })
      }
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
