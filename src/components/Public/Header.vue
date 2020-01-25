<template>
    <header class="w-100 border-right">
      <b-navbar id="public_header" type="light" toggleable="md" class="border-bottom border-light shadow-sm bg-white align-self-end">
        <b-navbar-toggle target="public_nav_collapse" class="border-0">
          <label>
            <font-awesome-icon :icon="['fas', 'bars']"></font-awesome-icon>
          </label>
        </b-navbar-toggle>

        <hamburger-menu class="d-none d-md-block text-dark mx-2"
                        name="ns-sidebar" />

          <b-collapse is-nav id="public_nav_collapse"
                      :class="{ visible }"
                      class="mw-100 flex-grow-1 bg-white"
                      @show="toggleNav(true)"
                      @hide="toggleNav(false)">
            <menu-level id="menu_lvl_1"
                        :pages="pages"
                        :selectedPath="selectedPath"
                        :currentPageID="page.pageID">

              <li slot="collapse" id="public_nav_collapse_0">
                <span>{{ $t('navigation.more') }}</span><ul></ul>
              </li>
            </menu-level>
          </b-collapse>
        <span class="page-title text-nowrap position-absolute d-block d-md-none ml-5" v-if="page">{{ page.title }}</span>

        <div id="right-nav-opts"
             class="position-absolute d-flex align-items-center">
          <router-link v-if="namespace.canManageNamespace"
                      :to="{ name: 'admin.modules' }"
                      class="nav-link mw-100 text-nowrap">{{ $t('navigation.adminPanel') }}</router-link>

          <hamburger-menu class="d-none d-md-block mr-2"
                          name="right-panel" />
        </div>
      </b-navbar>
    </header>
</template>
<script>
import { mapGetters } from 'vuex'
import MenuLevel from './MenuLevel'
import navbarCollapse from 'corteza-webapp-compose/src/mixins/navbar_collapse'
import { compose } from '@cortezaproject/corteza-js'
import HamburgerMenu from 'corteza-webapp-common/src/components/Sidebar/HamburgerMenu'

export default {
  components: {
    MenuLevel,
    HamburgerMenu,
  },

  mixins: [navbarCollapse],

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    page: {
      type: compose.Page,
      required: true,
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
    }),

    selectedPath () {
      const tt = (pp, pageID) => {
        if (!pp) {
          return false
        }

        for (let i = 0; i < pp.length; i++) {
          if (pp[i].pageID === pageID) {
            return [pageID]
          }

          const path = tt(pp[i].children, pageID)
          if (path) {
            path.unshift(pp[i].pageID)
            return path
          }
        }

        return false
      }

      return tt(this.tree, this.page.pageID) || []
    },
  },

  mounted () {
    this.$nextTick(() => {
      const nav = document.getElementById('menu_lvl_1')
      const bb = document.getElementById('public_header')
      const collapse = document.getElementById('public_nav_collapse_0')
      const customCollapser = document.getElementById('right-nav-opts')

      setTimeout(() => { this.collapser(nav, bb, collapse, customCollapser) }, 1)
      window.onresize = () => {
        this.collapser(nav, bb, collapse, customCollapser)
      }
    })
  },

  created () {
    this.$ComposeAPI
      .pageTree({ namespaceID: this.namespace.namespaceID })
      .then((result) => {
        this.tree = Object.freeze(result.map(p => new compose.Page(p)))
      })
  },

  methods: {
    collapser (nav, bb, collapse, customCollapser = null, buffer = 32) {
      if (!nav || !bb || !collapse) return

      const { children: navChildren = new HTMLCollection() } = nav
      const [collapseBody] = collapse.getElementsByTagName('UL')
      if (!collapseBody) return

      const { clientWidth: collapseWidth } = collapse
      let { clientWidth: bbWidth } = bb
      if (customCollapser) bbWidth -= customCollapser.clientWidth

      // Check if overflow possible
      if (nav.clientWidth + buffer >= bbWidth) {
        let c = null
        // -2; skip last element (the 'more' dropdown)
        for (let i = navChildren.length - 2; i >= 0; i--) {
          c = navChildren.item(i)

          const { clientWidth, offsetLeft } = c
          const elPos = clientWidth + offsetLeft + buffer + collapseWidth

          if (elPos >= bbWidth) {
            c.dataset.collapsed = true
            c.dataset.clientWidth = clientWidth

            // Initial show
            if (this.collapsedCount <= 0) {
              this.collapsedCount = 0
              collapse.style.visibility = 'visible'
            }
            this.collapsedCount++

            if (!collapseBody.firstChild) {
              collapseBody.append(c)
            } else {
              collapseBody.insertBefore(c, collapseBody.firstChild)
            }
          } else {
            return
          }
        }
      } else {
        // Check if any can be uncollapsed
        const collapsedNodes = document.querySelectorAll('[data-collapsed]')

        for (let i = 0; i < collapsedNodes.length; i++) {
          const cn = collapsedNodes[i]
          if ((parseInt(cn.dataset.clientWidth) || cn.clientWidth) + nav.clientWidth + buffer <= bbWidth) {
            delete cn.dataset.collapsed
            nav.insertBefore(cn, collapse)
            this.collapsedCount--

            if (this.collapsedCount <= 0) {
              this.collapsedCount = 0
              collapse.style.visibility = 'hidden'
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
.navbar {
  height: $navbar-height;
}

.page-title {
  max-width: calc(100vw - 150px);
  overflow: hidden;
}

.navbar-toggler {
  &:focus,
  &:hover {
    outline: none;
  }
}

#right-nav-opts {
  right: 0;
}

#public_nav_collapse {
  #public_nav_collapse_0 {
    visibility: hidden;

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

    &:hover > ul {
      max-width: 200px;

      & > li > ul {
        visibility: visible;
      }
    }
  }
}

@media (max-width: 768px) {
  .navbar-collapse {
    z-index: 1;
    top: $navbar-height;
    width: $sidebar-width;
    height: $sidebar-height;
    overflow-y: auto;
    position: absolute;
  }
}
</style>
