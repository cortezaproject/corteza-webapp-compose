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
                        :currentPageID="currentPageID">

              <li slot="collapse" id="public_nav_collapse_0">
                <span>More</span><ul></ul>
              </li>
            </menu-level>
          </b-collapse>
        <span class="page-title">{{ currentPage.title }}</span>
        <router-link id="public_nav_to_admin_pannel" :to="{ name: 'admin' }" class="nav-link admin-panel">Admin panel</router-link>
      </b-navbar>
    </header>
</template>
<script>
import { mapGetters } from 'vuex'
import MenuLevel from './MenuLevel'

const COLLAPSER_WIDTH = 55

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
      collapsedCount: 0,
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
    collapser (nav, bb, collapse, extraOffset, rightOffset) {
      const { children: nChildren = new HTMLCollection() } = nav
      const collapseBody = collapse.getElementsByTagName('UL')[0]
      if (!collapseBody) {
        return
      }

      const bbCWidth = bb.clientWidth - rightOffset

      // Check if overflow possible
      if (nav.clientWidth >= bbCWidth) {
        let c = null
        // -2; skip last element (the 'more' dropdown)
        for (let i = nChildren.length - 2; i >= 0; i--) {
          c = nChildren.item(i)

          const { clientWidth, offsetLeft } = c
          if (clientWidth + offsetLeft + extraOffset > bbCWidth) {
            c.dataset.collapsed = true
            c.dataset.clientWidth = clientWidth

            // If none collapsed; element is hidden
            if (!this.collapsedCount) {
              collapse.style.display = 'inline-block'
            }
            this.collapsedCount++
            collapseBody.appendChild(c)
          }
        }
      } else {
        // Check if any can be uncollapsed
        const collapsedNodes = document.querySelectorAll('[data-collapsed]')

        for (let i = collapsedNodes.length - 1; i >= 0; i--) {
          const cn = collapsedNodes[i]
          if (parseInt(cn.dataset.clientWidth) + nav.clientWidth + extraOffset <= bbCWidth) {
            delete cn.dataset.collapsed
            delete cn.dataset.clientWidth
            nav.insertBefore(cn, collapse)
            this.collapsedCount--

            if (!this.collapsedCount) {
              collapse.style.display = 'none'
            }
          }
        }
      }
    },
  },

  created () {
    this.$crm.pageTree().then((result) => { this.tree = result })
  },

  mounted () {
    this.$nextTick(() => {
      const nav = document.getElementById('menu_lvl_1')
      const bb = document.getElementById('nav_text_collapse')
      const collapse = document.getElementById('public_nav_collapse_0')
      const rOffset = document.getElementById('public_nav_to_admin_pannel').clientWidth + 50 || 200

      this.collapser(nav, bb, collapse, COLLAPSER_WIDTH, rOffset)
      window.onresize = () => {
        this.collapser(nav, bb, collapse, COLLAPSER_WIDTH, rOffset)
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

#public_nav_collapse_0 {
  display: none;
}
</style>

<style lang="scss">
#public_nav_collapse_0 > ul > li > ul {
  display: inline-block;
}

#nav_text_collapse li[data-collapsed="true"] ul {
  position: relative;
  left: 0;
  padding-left: 15px;
}
</style>
