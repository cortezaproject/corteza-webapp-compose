<template>
  <div class="view">
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
