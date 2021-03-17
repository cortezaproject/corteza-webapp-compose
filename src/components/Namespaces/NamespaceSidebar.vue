<template>
  <div>
    <div
      class="mobile-top-nav bg-white p-3"
    >
      <b-btn
        variant="link"
        @click="expanded=true"
        class="float-left"
      >
        (OPEN!)
      </b-btn>

      <div class="logo-ph float-left" />
    </div>

    <div
      v-if="showBackdrop"
      class="position-fixed backdrop vh-100"
      @click="expanded=false"
    />

    <!--
      Content spacer
      Large and xl screens should push in content when the nav is expanded
    -->
    <template>
      <div
        class="d-none d-lg-block spacer"
        :class="{
          expanded,
        }"
      />
    </template>

    <nav
      class="bg-white"
      :class="{
        'collapsed': !expanded,
      }"
    >

      <header class="position-sticky fixed-top">
        <b-container
          fluid
          class="bg-light pt-4"
        >
          <b-row>
            <b-col class="d-inline-flex align-items-center">
              <div class="logo-ph" />
              <span
                class="ml-2"
              >
                Corteza#
              </span>
            </b-col>
          </b-row>

          <b-row class="mt-3">
            <b-col>
              <vue-select
                key="namespaceID"
                label="name"
                class="bg-white"
                :clearable="false"
                :options="namespaces"
                :value="namespace"
                @option:selected="$router.push({ name: 'namespace', params: { slug: $event.slug } })"
              >
                <template #list-footer>
                  <router-link :to="{ name: 'namespace.create' }"
                               class="mt-3 ml-3 mb-1 font-weight-bold d-block"
                  >
                    {{ $t('sidebar.createNS') }}
                  </router-link>
                </template>
              </vue-select>
            </b-col>
          </b-row>

          <b-row
            class="mt-3 pt-4 pb-2 bg-white"
          >
            <b-col>
              <b-input
                v-model.trim="query"
                class="mw-100"
                type="search"
                :placeholder="$t('sidebar.searchPlaceholder')"
              />
            </b-col>
          </b-row>
        </b-container>
      </header>

      <div
        class="header-delimiter bg-light"
      />

      <sidebar-nav-item
        :items="navItems"
        :start-expanded="!!query"
        top-level
        @page-selected="onPageSelected"
        class="overflow-auto h-100"
      />

      <!-- Footer -->
      <footer class="position-sticky fixed-bottom bg-white">
        <b-container
          fluid
        >
        <b-row>
          <b-col>
            <b-btn
              v-if="expanded"
              variant="link"
              class="float-left"
              @click="expanded=false"
            >
              left
            </b-btn>

            <b-btn
              variant="link"
              class="float-right"
            >
              logout
            </b-btn>
            <b-btn
              variant="link"
              class="float-right"
              :to="{ name: 'admin.modules' }"
            >
              admin
            </b-btn>

            <b-btn
              v-if="!expanded"
              variant="link"
              class="float-right"
              @click="expanded=true"
            >
              right
            </b-btn>
          </b-col>
        </b-row>
        </b-container>
      </footer>
    </nav>
  </div>
</template>

<script>
import { NoID } from '@cortezaproject/corteza-js'
import SidebarNavItem from './SidebarNavItem'
import { VueSelect } from 'vue-select'

export default {
  components: {
    SidebarNavItem,
    VueSelect,
  },

  props: {
    namespaces: {
      type: Array,
      required: true,
      default: () => [],
    },

    namespace: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    pages: {
      type: Array,
      required: true,
      default: () => [],
    },

    page: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    screenSize: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data () {
    return {
      query: '',
      expanded: false,
    }
  },

  computed: {
    showBackdrop () {
      return this.screenSize === 's' && this.expanded
    },

    navItems () {
      const wrap = (p) => ({ page: p, children: [] })

      const current = this.filteredPages.map(wrap)
      const cx = this.pageIndex(current)
      const ax = this.pageIndex(this.pages.map(wrap))

      for (let i = current.length - 1; i >= 0; i--) {
        const cp = current[i]

        // Here, we'll need to nest our pages.
        // If the requested page isn't in the current index, check in the all index.
        // If still not there, just place it somewhere...
        if (cp.page.selfID && cp.page.selfID !== NoID) {
          let p = cx[cp.page.selfID]
          if (!p) {
            if (ax[cp.page.selfID]) {
              current.splice(i, 1, ax[cp.page.selfID])
              p = ax[cp.page.selfID]
              cx[p.page.pageID] = p
            } else {
              current.splice(i, 0, cp)
              p = cp
            }
            i++
          } else {
            current.splice(i, 1)
          }
          p.children.push(cp)
        }
      }

      return current
    },

    filteredPages () {
      if (!this.query) {
        return this.pages
      }

      const rr = []
      for (const p of this.pages) {
        if (this.checkPage(p, this.query)) {
          rr.push(p)
        }
      }

      return rr
    },
  },

  watch: {
    screenSize: {
      handler (ss) {
        if (ss === 'xl') {
          this.expanded = true
        } else {
          this.expanded = false
        }
      },
    },
  },

  methods: {
    onPageSelected () {
      if (this.screenSize === 's') {
        this.expanded = false
      }
    },

    checkPage (p, query) {
      const ix = `${p.pageID}${p.handle}${p.title}`.toLowerCase().trim()
      return ix.indexOf(query.toLowerCase().trim()) > -1
    },

    pageIndex (wraps) {
      const ix = {}

      for (const w of wraps) {
        ix[w.page.pageID] = w
      }

      return ix
    },
  },

}
</script>

<style lang="scss" scoped>

.backdrop {
  background-color: #1e1e1eA5;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9000;
}

.mobile-top-nav {
  width: 100vw;
  position: fixed;
  top: 0;
  height: 55px;
  overflow: hidden;
}

.spacer {
  width: 0;
  transition: width 0.1s;

  &.expanded {
    width: 350px;
  }
}

nav {
  width: 320px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  max-width: 100%;
  max-height: 100%;
  margin: 0;
  outline: 0;
  transform: translateX(0);
  transition: transform 0.1s;

  &.collapsed {
    transform: translateX(-320px);
  }

  .header-delimiter {
    width: calc(100% - 20px);
    margin: 0 auto;
    height: 1px;
  }

  header {
    display: flex;
    flex-direction: row;
    flex-grow: 0;
    align-items: center;
  }

  .body {
    flex-grow: 1;
    height: 100%;
    overflow-y: auto;
  }

  footer {
    flex-grow: 0;
  }
}

.logo-ph {
  width: 50px;
  height: 50px;
  background-color: orange;
}

</style>
