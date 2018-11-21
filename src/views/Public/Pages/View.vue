<template>
  <div class="view">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand>CRUST CRM</b-navbar-brand>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item-dropdown :title="page.description" :text="page.title" v-if="page.children.length > 0" v-bind:class="{ 'active': page.active }" v-for="page in pages" v-bind:key="page.id">
            <b-dropdown-item :title="page.description" v-bind:class="{ 'active': page.active && viewPageData.id === page.id }" :to="'/pages/' + page.id">{{ page.title }}</b-dropdown-item>
            <b-dropdown-item :title="pageChild.description" v-bind:class="{ 'active': pageChild.active }" v-for="pageChild in page.children" v-bind:key="pageChild.id" :to="'/pages/' + pageChild.id">{{ pageChild.title }}</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item :title="page.description" v-if="page.children.length == 0" :to="'/pages/' + page.id" v-bind:class="{ 'active': page.active }" v-for="page in pages" v-bind:key="page.id">
            {{page.title}}
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
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
  props: {
    pageID: {
      type: String,
    },
  },

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
      pagesList: [],
    }
  },
  async created () {
    this.$store.dispatch('pages/initViewPageData', this.pageID)
    this.pagesList = await this.$crm.pageList({})
    this.cancelFcn = this.$router.beforeEach((to, from, next) => {
      if (to.fullPath.startsWith('/crm/pages/')) {
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
      viewPageData: state => state.pages.viewPageData,
      pages (state) {
        // Parent page : filter by page with no module + visible + no parent
        const parentPages = this.pagesList.filter(page => {
          return (
            page.visible &&
            !page.module &&
            (page.selfID === 0 ||
              page.selfID === '0' ||
              page.selfID === null ||
              page.selfID === undefined)
          )
        })
        // Children page : filter by no module + visible + has parent
        const childrenPages = this.pagesList.filter(page => {
          return (
            page.visible &&
            !page.module &&
            (page.selfID !== 0 &&
              page.selfID !== '0' &&
              page.selfID !== null &&
              page.selfID !== undefined)
          )
        })

        // Add chidren to each parent + set the 'active' property
        parentPages.forEach(value => {
          value.children = []
          value.active = value.id === state.pages.viewPageData.id
          childrenPages.forEach(valueHere => {
            valueHere.active = valueHere.id === state.pages.viewPageData.id

            // If this child has this parent
            if (valueHere.selfID === value.id) {
              value.children.push(valueHere)

              // If child active => parent too !
              if (valueHere.id === state.pages.viewPageData.id) {
                value.active = true
              }
            }
          })
        })
        return parentPages
      },
    }),
  },
}
</script>
