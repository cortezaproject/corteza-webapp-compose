<template>
  <div>
    <portal to="topbar-title">
      {{ selectedPageTitle }}
    </portal>

    <portal to="sidebar-header-expanded">
      <vue-select
        key="namespaceID"
        label="name"
        class="namespace-selector sticky-top bg-white my-2"
        :clearable="false"
        :options="namespaces"
        :value="namespace"
        @option:selected="$router.push({ name: 'namespace', params: { slug: $event.slug } })"
      >
        <template #list-footer>
          <router-link
            :to="{ name: 'namespace.create' }"
            class="d-block mt-3 ml-3 mb-1 font-weight-bold"
          >
            {{ $t('sidebar.createNS') }}
          </router-link>
        </template>
      </vue-select>
    </portal>

    <portal
      to="sidebar-body-expanded"
    >
      <div
        class="h-100"
      >
        <b-button
          v-if="namespace.canManageNamespace"
          variant="light"
          class="w-100 mb-2"
          :to="{ name: 'admin.modules' }"
        >
          {{ $t('navigation.adminPanel') }}
        </b-button>

        <b-input
          v-model.trim="query"
          class="namespace-selector mw-100"
          type="search"
          :placeholder="$t('sidebar.searchPlaceholder')"
        />

        <sidebar-nav-item
          :items="navItems"
          :start-expanded="!!query"
          top-level
          @page-selected="onPageSelected"
          class="overflow-auto h-100"
        />
      </div>
    </portal>

    <portal
      to="sidebar-footer-collapsed"
      class="d-flex"
    >
    </portal>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { NoID } from '@cortezaproject/corteza-js'
import { Portal } from 'portal-vue'
import { VueSelect } from 'vue-select'
import SidebarNavItem from './SidebarNavItem'

export default {
  components: {
    Portal,
    VueSelect,
    SidebarNavItem,
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
  },

  data () {
    return {
      query: '',
      selectedPage: undefined,
      selectedPageTitle: '',
    }
  },

  computed: {
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
    '$route.params.pageID': {
      immediate: true,
      handler (pageID = '') {
        const { namespaceID } = this.namespace

        if (namespaceID && pageID) {
          this.findPageByID({ namespaceID, pageID }).then(({ title = '', handle = '' }) => {
            this.selectedPageTitle = title || handle || this.$t('navigation.noPageTitle')
          })
        }
      },
    },
  },

  methods: {
    ...mapActions({
      findPageByID: 'page/findByID',
    }),

    onPageSelected (page) {
      this.selectedPage = page
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
.right-inner-addon i {
  position: absolute;
  right: 0;
  padding: 10px 12px;
  pointer-events: none;
}

.backdrop {
  background-color: #1e1e1eA5;
  top: $topbar-height;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
}

.sidebar-nav-trigger {
  height: $topbar-height;
}

.namespace-selector {
  font-size: 1rem;
}

nav {
  width: $sidebar-width;
  height: calc(100vh - #{$topbar-height});
  position: fixed;
  left: 0;
  bottom: 0;
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
    transform: translateX(-($sidebar-width));
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
}

.logo-ph {
  width: 50px;
  height: 50px;
  background-color: orange;
}
</style>
