<template>
  <div>
    <div
      class="header-navigation d-flex align-items-center justify-content-between position-absolute sticky-top"
    >
      <div class="header d-flex align-items-center"
           :class="{
        'bg-light shadow-sm': expanded,
          }"
      >
        <b-btn
          variant="outline-light"
          @click="expanded=!expanded"
          size="lg"
          class="text-dark border-0 mx-2"
        >
          <font-awesome-icon
            :icon="['fas', 'bars']"
          />
        </b-btn>
        <div class="logo ml-3"
             :class="{
            'd-none': !expanded,
            }"
        />
        <h3 class="m-0"
            :class="{
            'd-none': expanded,
            }"
        >
          Page title
        </h3>
<!--        <b-input-->
<!--          v-model.trim="query"-->
<!--          class="col-lg-7 col-xl-5"-->
<!--          type="search"-->
<!--          :placeholder="$t('sidebar.searchPlaceholder')"-->
<!--        />-->
      </div>
      <div class="text-nowrap d-flex flex-grow-1 justify-content-end">
        <b-form-input type="text"
                      name="search"
                      placeholder="Search..."
                      class="ml-3" />
        <b-dropdown size="lg"
                    variant="outline-light"
                    toggle-class="text-decoration-none text-dark border-0"
                    menu-class="border-0 shadow-sm text-dark font-weight-bold mt-2"
                    right
                    no-caret>
          <template #button-content>
            <font-awesome-icon
              class="m-0 h5"
              :icon="['far', 'question-circle']"
            />
            <span class="sr-only">Help</span>
          </template>
          <b-dropdown-item href="https://forum.cortezaproject.org/"
                           target="_blank">
            {{ $t('navigation.help.forum') }}
          </b-dropdown-item>
          <b-dropdown-item href="http://docs.cortezaproject.org/"
                           target="_blank">
            {{ $t('navigation.help.documentation') }}
          </b-dropdown-item>
          <b-dropdown-item href="mailto:info@crust.tech"
                           target="_blank">
            {{ $t('navigation.help.feedback') }}
          </b-dropdown-item>
        </b-dropdown>
        <b-dropdown size="lg"
                    variant="outline-light"
                    toggle-class="text-decoration-none text-dark border-0"
                    menu-class="border-0 shadow-sm text-dark font-weight-bold mt-2"
                    right
                    no-caret>
          <template #button-content>
            <font-awesome-icon
              class="m-0 h5"
              :icon="['fas', 'user-cog']"
            />
            <span class="sr-only">
              {{ $t('navigation.help.forum') }}
            </span>
          </template>
          <b-dropdown-text class="text-muted mb-2">
            Logged in as Denis Arh
          </b-dropdown-text>
          <b-dropdown-item href="">
            {{ $t('navigation.userSettings.profile') }}
          </b-dropdown-item>
          <b-dropdown-item href="">
            {{ $t('navigation.userSettings.changePassword') }}
          </b-dropdown-item>
          <b-dropdown-item href="">
            {{ $t('navigation.userSettings.logout') }}
          </b-dropdown-item>
        </b-dropdown>
        <b-btn
          variant="outline-light"
          to="#"
          size="lg"
          class="text-dark border-0 mr-2"
        >
          <font-awesome-icon
            class="m-0 h5"
            :icon="['fas', 'grip-horizontal']"
          />
        </b-btn>
      </div>
    </div>
    <div
      v-if="showBackdrop"
      class="position-fixed backdrop vh-100"
      @click="expanded=!expanded"
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
      class="bg-white shadow-sm"
      :class="{
        'collapsed': !expanded,
      }"
    >

      <header class="position-sticky fixed-top bg-light">
        <b-container
          fluid
        >
          <b-row class="mt-2">
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
            class="mt-3 py-3 bg-white"
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

      <sidebar-nav-item
        :items="navItems"
        :start-expanded="!!query"
        top-level
        @page-selected="onPageSelected"
        class="overflow-auto h-100"
      />

      <!-- Footer -->
      <footer class="position-sticky fixed-bottom bg-white pb-2">
        <b-container
          fluid
        >
          <b-row>
            <b-col>
              <b-btn
                variant="light"
                block
                :to="{ name: 'admin.modules' }"
              >
                {{ $t('navigation.adminPanel') }}
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
      type: String,
      required: false,
      default: 's',
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
$header-height: 60px;
$sidebar-bg: #F4F7FA;
$nav-width: 320px;
$logo-width: 150px;

input[type=text] {
  width: 90px;
  -webkit-transition: width 0.4s ease-in-out;
  transition: width 0.4s ease-in-out;
  background: transparent;
  border: none;

  /* When the input field gets focus, change its width to 100% */
  &:focus {
    width: 100%;
    background: white;
    border: 2px solid #4D7281;
  }

  &::placeholder {
    color: black;
    content: "test";
  }
}

.right-inner-addon i {
  position: absolute;
  right: 0;
  padding: 10px 12px;
  pointer-events: none;
}

.bg-light {
  background-color: $sidebar-bg !important;
}

.backdrop {
  background-color: #1e1e1eA5;
  top: $header-height;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9000;
}

.header-navigation {
  width: 100vw;
  min-height: $header-height;

  .logo {
    height: calc(#{$header-height} / 2);
    min-width: $logo-width;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .header {
    width: $nav-width;
    height: $header-height;
  }
}

.sidebar-nav-trigger {
  height: $header-height;
}

.spacer {
  width: 0;
  transition: width 0.1s;

  &.expanded {
    width: $nav-width;
  }
}

nav {
  width: $nav-width;
  height: calc(100vh - #{$header-height});
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
    transform: translateX(-($nav-width));
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
