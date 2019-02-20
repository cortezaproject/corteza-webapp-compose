<template>
    <header>
      <b-navbar toggleable type="light" toggle-breakpoint="lg">
          <b-navbar-toggle target="nav_text_collapse">
            <label
              class="channel-toggle">
              <i class="icon-menu4"></i>
            </label>
          </b-navbar-toggle>
          <b-collapse is-nav id="nav_text_collapse" :class="{ visible }" @show="toggleNav(true)" @hide="toggleNav(false)">
            <menu-level id="menu_lvl_1"
                        :pages="pages"
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

const UNCOLLAPSE_BUFFER = 100

export default {
  props: {
    currentPageID: {
      type: String,
    },
  },

  data () {
    return {
      tree: [],
      visible: false,
    }
  },

  methods: {
    toggleNav (visible) {
      this.visible = visible
      this.$emit('toggleNav', visible)
    },
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

  methods: {
    collapser (nav, bb) {
      const { children: nChildren = new HTMLCollection() } = nav
      const collapse = nChildren[nChildren.length - 1]
      const collapseBody = collapse.getElementsByTagName('UL')[0]
      if (!collapseBody) {
        return
      }

      const extraOffset = collapse.clientWidth || 0

      // Check if overflow possible
      if (nav.clientWidth >= bb.clientWidth) {
        let c = null
        // -2; skip last element (the 'more' dropdown)
        for (let i = nChildren.length - 2; i >= 0; i--) {
          c = nChildren.item(i)

          const { clientWidth, offsetLeft } = c
          if (clientWidth + offsetLeft + extraOffset > bb.clientWidth) {
            c.dataset.collapsed = true
            collapseBody.appendChild(c)
          }
        }
      } else {
        // Check if any can be uncollapsed
        const collapsedNodes = document.querySelectorAll('[data-collapsed]')

        for (let i = collapsedNodes.length - 1; i >= 0; i--) {
          const cn = collapsedNodes[i]
          if (cn.clientWidth + nav.clientWidth + extraOffset + UNCOLLAPSE_BUFFER <= bb.clientWidth) {
            delete cn.dataset.collapsed
            nav.insertBefore(cn, collapse)
          }
        }
      }
    },
  },

  created () {
    this.$crm.pageTree().then((result) => { this.tree = result })

    this.$nextTick(() => {
      const nav = document.getElementById('menu_lvl_1')
      const bb = document.getElementById('nav_text_collapse')

      this.collapser(nav, bb)
      window.onresize = () => {
        this.collapser(nav, bb)
      }
    })
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

<style lang="scss">
#nav_text_collapse li[data-collapsed="true"] ul {
  position: relative;
  left: 0;
  padding-left: 15px;
}
</style>
