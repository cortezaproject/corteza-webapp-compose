<template>
    <header>
      <b-navbar type="light" toggleable="md">
          <b-navbar-toggle target="public_nav_collapse">
            <label
              class="channel-toggle">
              <i class="icon-menu4"></i>
            </label>
          </b-navbar-toggle>
          <b-collapse is-nav id="public_nav_collapse" :class="{ visible }" @show="toggleNav(true)" @hide="toggleNav(false)">
            <menu-level id="menu_lvl_1"
                        :pages="pages"
                        :selectedPath="selectedPath"
                        :currentPageID="currentPageID">

              <li slot="collapse" id="public_nav_collapse_0">
                <span>{{ $t('navigation.more') }}</span><ul></ul>
              </li>
            </menu-level>
          </b-collapse>
        <span class="page-title">{{ currentPage.title }}</span>
        <router-link id="public_nav_to_admin_pannel" :to="{ name: 'admin' }" class="nav-link admin-panel">{{ $t('navigation.adminPanel') }}</router-link>
      </b-navbar>
    </header>
</template>
<script>
import { mapGetters } from 'vuex'
import MenuLevel from './MenuLevel'
import navbarCollapse from '@/mixins/navbar_collapse'

const collapserWidth = 55

export default {
  components: {
    MenuLevel,
  },

  mixins: [ navbarCollapse ],

  props: {
    currentPageID: {
      type: String,
    },
  },

  data () {
    return {
      tree: [],
      collapsedCount: 0,
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

  mounted () {
    this.$nextTick(() => {
      const nav = document.getElementById('menu_lvl_1')
      const bb = document.getElementById('public_nav_collapse')
      const collapse = document.getElementById('public_nav_collapse_0')
      const rOffset = document.getElementById('public_nav_to_admin_pannel').clientWidth + 50 || 200

      setTimeout(() => { this.collapser(nav, bb, collapse, collapserWidth, rOffset) }, 1)
      window.onresize = () => {
        this.collapser(nav, bb, collapse, collapserWidth, rOffset)
      }
    })
  },

  created () {
    this.$crm.pageTree().then((result) => { this.tree = result })
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
            if (!collapseBody.firstChild) {
              collapseBody.append(c)
            } else {
              collapseBody.insertBefore(c, collapseBody.firstChild)
            }
          }
        }
      } else {
        // Check if any can be uncollapsed
        const collapsedNodes = document.querySelectorAll('[data-collapsed]')

        for (let i = 0; i < collapsedNodes.length; i++) {
          const cn = collapsedNodes[i]
          if ((parseInt(cn.dataset.clientWidth) || cn.clientWidth) + nav.clientWidth + extraOffset <= bbCWidth) {
            delete cn.dataset.collapsed
            nav.insertBefore(cn, collapse)
            this.collapsedCount--

            if (!this.collapsedCount) {
              collapse.style.display = 'none'
            }
          } else {
            return
          }
        }
      }
    },
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

#public_nav_collapse {
  #public_nav_collapse_0 {
    display: none;

    a {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    & > ul {
      overflow: hidden;

      & > li {
        & > ul {
          display: inline-block;
        }
      }
    }

    ul li ul {
      width: 100%;
    }

    &:hover > ul {
      max-width: 200px;

      & > li > ul {
        visibility: visible;
      }
    }
  }
}

@media (max-width: 768px) {
  #public_nav_collapse_0 {
    width: 100%;

    & > span {
      display: none;
    }

    & > ul {
      padding-left: 0;
      max-width: unset;
    }
  }
}
</style>
