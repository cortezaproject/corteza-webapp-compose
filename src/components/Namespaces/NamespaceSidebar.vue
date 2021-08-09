<template>
  <div>
    <portal to="sidebar-header-expanded">
      <vue-select
        key="namespaceID"
        label="name"
        class="namespace-selector sticky-top bg-white mt-2"
        :clearable="false"
        :options="namespaces"
        :value="namespace"
        :placeholder="$t('sidebar.pickNamespace')"
        @option:selected="namespaceSelected"
      >
        <template #list-footer>
          <router-link
            :to="{ name: 'namespace.list' }"
            class="d-block mt-3 ml-3 mb-1 font-weight-bold"
          >
            {{ $t('sidebar.namespaceList') }}
          </router-link>
        </template>
      </vue-select>
    </portal>

    <portal
      v-if="!pending && namespace"
      to="sidebar-body-expanded"
    >
      <b-button
        v-if="!pending && isAdminPage"
        variant="light"
        class="w-100 mb-2"
        :to="{ name: 'pages', params: { slug: namespace.slug } }"
      >
        {{ $t('navigation.publicPages') }}
      </b-button>

      <b-button
        v-else-if="!pending && namespace && namespace.canManageNamespace"
        variant="light"
        class="w-100 mb-2"
        :to="{ name: 'admin.modules', params: { slug: namespace.slug } }"
      >
        {{ $t('navigation.adminPanel') }}
      </b-button>

      <div
        v-if="navItems.length"
        class="h-100"
      >
        <b-input
          v-if="!isAdminPage"
          v-model.trim="query"
          class="namespace-selector mw-100"
          type="search"
          :placeholder="$t('sidebar.searchPlaceholder')"
        />

        <c-sidebar-nav-items
          :items="navItems"
          :start-expanded="!!query"
          default-route-name="page"
          class="overflow-auto h-100"
        />
      </div>

      <h5
        v-else
        class="d-flex justify-content-center mt-5"
      >
        {{ $t('sidebar.noPages') }}
      </h5>
    </portal>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { NoID } from '@cortezaproject/corteza-js'
import { components } from '@cortezaproject/corteza-vue'
import { Portal } from 'portal-vue'
import { VueSelect } from 'vue-select'
const { CSidebarNavItems } = components

export default {
  components: {
    Portal,
    VueSelect,
    CSidebarNavItems,
  },

  props: {
    namespaces: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data () {
    return {
      query: '',

      namespace: undefined,
    }
  },

  computed: {
    ...mapGetters({
      namespacePending: 'namespace/pending',
      modulePending: 'module/pending',
      chartPending: 'chart/pending',
      pagePending: 'page/pending',
      pages: 'page/set',
    }),

    pending () {
      return this.namespacePending || this.modulePending || this.chartPending || this.pagePending
    },

    isAdminPage () {
      return this.$route.name.includes('admin.')
    },

    adminRoutes () {
      return [
        { name: 'admin.modules', title: this.$t('navigation.module') },
        { name: 'admin.pages', title: this.$t('navigation.page') },
        { name: 'admin.charts', title: this.$t('navigation.chart') },
      ]
    },

    navItems () {
      let wrap = (page) => ({ page, children: [], params: { pageID: page.pageID } })

      if (this.isAdminPage) {
        wrap = (page) => ({ page, children: [], params: {} })
      }

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
      if (this.namespace) {
        // If on admin page, show admin pages. Otherwise show public pages
        const pages = this.isAdminPage ? this.adminRoutes : this.pages.filter(({ moduleID, visible }) => visible && moduleID === NoID)

        if (!this.query) {
          return pages
        }

        const rr = []
        for (const p of pages) {
          if (this.checkPage(p, this.query)) {
            rr.push(p)
          }
        }

        return rr
      }

      return []
    },
  },

  watch: {
    '$route.params.slug': {
      immediate: true,
      handler (slug = '') {
        this.namespace = slug ? this.namespaces.find(n => n.slug === slug) : undefined
      },
    },
  },

  methods: {
    ...mapActions({
      findPageByID: 'page/findByID',
    }),

    namespaceSelected ({ canManageNamespace, slug = '' }) {
      let { name, params } = this.$route

      // Try to match page, otherwise redirect to pages root
      if (name.includes('admin.modules')) {
        name = 'admin.modules'
      } else if (name.includes('admin.pages')) {
        name = 'admin.pages'
      } else if (name.includes('admin.charts')) {
        name = 'admin.charts'
      }

      name = !params.pageID && canManageNamespace && !name.includes('namespace.') ? name : 'pages'

      this.$router.push({ name, params: { slug } })
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

<style lang="scss">
.namespace-selector {
  font-size: 1rem;

  .vs__selected-options {
    flex-wrap: nowrap;
  }

  .vs__selected {
    max-width: 245px;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .vs__open-indicator {
    fill: $primary;
  }
}
</style>
