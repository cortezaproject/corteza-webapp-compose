<template>
  <div>
    <nav class="menu navbar navbar-expand-lg navbar-light bg-light">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item" v-bind:class="{ active: page.id === viewPageData.id }" v-for="page in pages" v-bind:key="page.id">
          <router-link class="nav-link" :to="'/pages/' + page.id">{{page.title}}</router-link>
        </li>
      </ul>
    </nav>
    <div class="content">
      <PageContent></PageContent>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
/* eslint-disable-next-line */
import VueGridLayout from "vue-grid-layout";
import PageContent from '@/components/PageContent'
export default {
  name: 'PublicPageView',
  components: {
    PageContent,
  },
  data () {
    return {
      wideWidth: 768,
      wide: false,
      window: {
        width: 0,
        height: 0,
      },
    }
  },
  created () {
    this.$store.dispatch('pages/initViewPageData', this.$route.params.id)
    this.$store.dispatch('pages/initList')
    this.cancelFcn = this.$router.beforeEach((to, from, next) => {
      if (to.fullPath.startsWith('/pages/')) {
        this.$store.dispatch('pages/initViewPageData', to.params.id)
      }
      next()
    })
  },
  destroyed () {
    this.cancelFcn()
  },
  computed: {
    ...mapState({
      pages: state => state.pages.list.filter(page => !page.module),
      viewPageData: state => state.pages.viewPageData,
    }),
  },
}
</script>
<style lang="scss" scoped>
@import "src/assets/styles/shared";
@import "~bootstrap/scss/bootstrap";

.menu {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  width: 100%;
  padding: 25px;
  a {
    &.active {
      text-decoration: none;
    }
    margin: 5px;
  }
}
.content {
}
</style>
