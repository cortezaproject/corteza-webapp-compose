<template>
  <div class="centering-wrap inactive-area w-100 flex-grow-1">
    <public-header :page="page"
                   :namespace="namespace"
                   @toggleNav="navVisible = $event" />
    <div v-if="showSteps" class="d-flex flex-column m-5 vh-75">
      <h1 class="display-3">Welcome!</h1>
      <p class="lead">
        It seems this namespace is not yet configured. Follow these steps to start building.
      </p>
      <b-container fluid class="align-items-center border-top steps">
        <b-row align-v="center" class="text-center justify-content-between">
          <b-col>
            <div class="mx-auto circle border-primary text-primary">
              <font-awesome-icon v-if="hasModules" :icon="['fas', 'check']" />
              <span v-else>1</span>
            </div>
            <b-button v-if="!hasModules" @click="createNewModule" :disabled="!namespace.canCreateModule" variant="outline-primary mt-5" size="lg">
              Create Module
            </b-button>
            <router-link v-else-if="namespace.canManageNamespace" :to="{ name: 'admin.modules' }">
              <b-button variant="primary mt-5" size="lg">
                Your Modules
              </b-button>
            </router-link>
          </b-col>
          <b-col>
            <hr />
          </b-col>
          <b-col>
            <div class="mx-auto circle border-primary text-primary" v-b-popover.hover.top="'This step is optional!'" :class="{ 'disabled-step': !hasCharts }">
              <font-awesome-icon v-if="hasCharts" :icon="['fas', 'check']" />
              <span v-else>?</span>
            </div>
            <div v-if="!hasCharts" class="d-flex justify-content-center align-items-center mt-5">
              <b-button @click="createNewChart" :disabled="!hasModules || !namespace.canCreateChart" variant="outline-primary" size="lg">
                Make Chart
              </b-button>
            </div>
            <router-link v-else-if="namespace.canManageNamespace" :to="{ name: 'admin.charts' }">
              <b-button variant="primary mt-5" size="lg">
                Your Charts
              </b-button>
            </router-link>
          </b-col>
          <b-col>
            <hr />
          </b-col>
          <b-col>
            <div class="mx-auto circle border-primary text-primary" :class="{ 'disabled-step': !hasModules }">
              <font-awesome-icon v-if="hasPages" :icon="['fas', 'check']" />
              <span v-else>2</span>
            </div>
            <b-button v-if="!hasPages" @click="createNewPage" :disabled="!hasModules || !namespace.canCreatePage" variant="outline-primary mt-5" size="lg">
              Build Page
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <router-view v-else
                 :namespace="namespace"
                 :page="page" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import PublicHeader from 'corteza-webapp-compose/src/components/Public/Header'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'
import Module from 'corteza-webapp-compose/src/lib/module'
import Chart from 'corteza-webapp-compose/src/lib/chart'
import Page from 'corteza-webapp-compose/src/lib/page'
import Field from 'corteza-webapp-compose/src/lib/field'

const pushContentAbove = 610

export default {
  name: 'public-root',

  components: {
    PublicHeader,
  },

  props: {
    pageID: {
      type: String,
      required: false,
      default: '',
    },

    namespace: { // via router-view
      type: Namespace,
      required: true,
    },
  },

  data () {
    return {
      navVisible: false,
      documentWidth: 0,
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
      pages: 'page/set',
      charts: 'chart/set',
    }),

    routerViewClass () {
      return {
        'compose-content': true,
        'padded': this.navVisible && this.canPushContent,
      }
    },

    canPushContent () {
      return this.documentWidth > pushContentAbove
    },

    page () {
      return this.$store.getters['page/getByID'](this.pageID) || new Page()
    },

    showSteps () {
      return !this.pageID && (!this.hasModules || !this.hasPages)
    },

    hasModules () {
      return !!this.modules.length
    },

    hasCharts () {
      return !!this.charts.length
    },

    hasPages () {
      return !!this.pages.length
    },
  },

  created () {
    this.documentWidth = document.body.offsetWidth
    window.onresize = () => {
      this.documentWidth = document.body.offsetWidth
    }
  },

  beforeMount () {
    if (!this.pageID) {
      let { pageID } = this.$store.getters['page/firstVisibleNonRecordPage'] || {}
      if (pageID) {
        this.$router.push({ name: 'page', params: { pageID } })
      }
    }
  },

  methods: {
    ...mapActions({
      createModule: 'module/create',
      createPage: 'page/create',
      createChart: 'chart/create',
    }),

    createNewModule () {
      const { namespaceID } = this.namespace
      const name = 'Demo Module'
      const newModule = new Module({ namespaceID, name, fields: [new Field({ fieldID: '0', name: 'Sample', kind: 'String' })] })
      this.createModule(newModule).then((module) => {
        this.$router.push({ name: 'admin.modules.edit', params: { moduleID: module.moduleID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.module.createFailed')))
    },

    createNewChart () {
      const { namespaceID } = this.namespace
      const name = 'Demo Chart'
      const newChart = new Chart({ namespaceID, name })
      this.createChart(newChart).then((chart) => {
        this.$router.push({ name: 'admin.charts.edit', params: { chartID: chart.chartID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.chart.createFailed')))
    },

    createNewPage () {
      const { namespaceID } = this.namespace
      const title = 'Test Page'
      const blocks = []
      const newPage = new Page({ namespaceID, title, blocks })
      this.createPage(newPage).then((page) => {
        this.$router.push({ name: 'admin.pages.builder', params: { pageID: page.pageID } })
      }).catch(this.defaultErrorHandler(this.$t('notification.page.saveFailed')))
    },
  },
}
</script>
<style lang="scss" scoped>
.circle {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  font-size: 35px;
  line-height: 75px;
  text-align: center;
  border: 2px solid;
}

.steps {
  padding: 0;
  padding-top: 20vh;
}

.disabled-step {
  opacity: 0.65;
}
</style>
