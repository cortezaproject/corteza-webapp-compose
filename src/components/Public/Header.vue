<template>
    <header>
      <b-navbar toggleable type="light" toggle-breakpoint="lg">
          <b-navbar-toggle target="nav_text_collapse">
            <label
              class="channel-toggle">
              <i class="icon-menu4"></i>
            </label>
          </b-navbar-toggle>
          <b-collapse is-nav id="nav_text_collapse">
            <menu-level :pages="pages"
                        :selectedPath="selectedPath"
                        :currentPageID="currentPageID"></menu-level>
          </b-collapse>
        <span class="page-title">{{ currentPage.title }}</span>
        <router-link :to="{ name: 'admin' }" class="nav-link admin-panel">Admin panel</router-link>
      </b-navbar>
    </header>
</template>
<script>
import { mapGetters } from 'vuex'
import MenuLevel from './MenuLevel'

export default {
  props: {
    currentPageID: {
      type: String,
    },
  },

  data () {
    return {
      tree: [],
    }
  },

  computed: {
    ...mapGetters({
      pages: 'page/set',
      getPageByID: 'page/getByID',
    }),
    currentPage () {
      return this.getPageByID(this.currentPageID)
    },

    selectedPath () {
      const tt = (pp, pageID) => {
        if (!pp) {
          return false
        }

        for (let i = 0; i < pp.length; i++) {
          if (pp[i].pageID === pageID) {
            return [pageID]
          }

          let path = tt(pp[i].children, pageID)
          if (path) {
            path.unshift(pp[i].pageID)
            return path
          }
        }

        return false
      }

      return tt(this.tree, this.pageID) || []
    },
  },

  created () {
    this.$crm.pageTree().then((result) => { this.tree = result })
  },

  components: {
    MenuLevel,
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/components/header.scss";

.page-title {
  left: 50px;
  top: 12px;
  position: absolute;
  font-size: 15px;
  font-family: $crustsemibold;
  max-width: calc(100vw - 150px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
