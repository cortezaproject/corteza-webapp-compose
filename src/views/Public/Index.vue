<template>
  <div class="centering-wrap inactive-area">
    <public-header :page="page"
                   :namespace="namespace"
                   @toggleNav="navVisible = $event" />
    <router-view v-if="namespace && page"
                 :namespace="namespace"
                 :page="page"
                 :class="`compose-content ${navVisible && canPushContent ? 'padded' : ''}`" />
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
    canPushContent () {
      return this.documentWidth > pushContentAbove
    },

    page () {
      if (this.pageID) {
        return this.$store.getters['page/getByID'](this.pageID)
      } else {
        return this.$store.getters['page/firstVisibleNonRecordPage'] || new Page()
      }
    },
  },

  created () {
    this.documentWidth = document.body.offsetWidth
    window.onresize = () => {
      this.documentWidth = document.body.offsetWidth
    }
  },

  mounted () {
    //
    console.log('mounted')
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
