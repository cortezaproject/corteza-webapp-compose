<template>
  <div class="centering-wrap inactive-area w-100 flex-grow-1">
    <public-header :page="page"
                   :namespace="namespace"
                   @toggleNav="navVisible = $event" />
    <div v-if="showSteps" class="d-flex flex-column m-5 vh-75">
      <h1 class="display-3">{{ $t('general.label.welcome') }}!</h1>
      <p class="lead">
        {{ $t('onboarding.message.noPages') }}
        <span v-if="namespace.canManageNamespace">
          {{ $t('onboarding.message.startBuilding') }}
        </span>
        <span v-else>
          {{ $t('onboarding.message.notifyAdministrator') }}
        </span>
      </p>
      <b-container v-if="namespace.canManageNamespace" fluid class="align-items-center border-top steps">
        <b-row align-v="center" class="text-center justify-content-between">
          <b-col>
            <circle-step stepNumber="1" :done="hasModules">
              <b-button v-if="!hasModules" @click="createNewModule" :disabled="!namespace.canCreateModule" variant="outline-primary" size="lg">
                {{ $t('onboarding.step.module.create') }}
              </b-button>
              <router-link v-else :to="{ name: 'admin.modules' }">
                <b-button :disabled="!namespace.canManageNamespace" variant="primary" size="lg">
                {{ $t('onboarding.step.module.view') }}
                </b-button>
              </router-link>
            </circle-step>
          </b-col>
          <b-col>
            <hr />
          </b-col>
          <b-col>
            <circle-step :done="hasCharts" :disabled="!hasModules" optional>
              <b-button v-if="!hasCharts" @click="createNewChart" :disabled="!hasModules || !namespace.canCreateChart" variant="outline-primary" size="lg">
                {{ $t('onboarding.step.chart.create') }}
              </b-button>
              <router-link v-else :to="{ name: 'admin.charts' }">
                <b-button :disabled="!namespace.canManageNamespace" variant="primary" size="lg">
                {{ $t('onboarding.step.chart.view') }}
                </b-button>
              </router-link>
            </circle-step>
          </b-col>
          <b-col>
            <hr />
          </b-col>
          <b-col>
            <circle-step stepNumber="2" :done="hasPages" :disabled="!hasModules">
              <b-button v-if="!hasPages" @click="createNewPage" :disabled="!hasModules || !namespace.canCreatePage" variant="outline-primary" size="lg">
                {{ $t('onboarding.step.page.create') }}
              </b-button>
              <router-link v-else :to="{ name: 'admin.pages' }">
                <b-button :disabled="!namespace.canManageNamespace" variant="primary" size="lg">
                {{ $t('onboarding.step.page.view') }}
                </b-button>
              </router-link>
            </circle-step>
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
import CircleStep from 'corteza-webapp-compose/src/components/Common/CircleStep'
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
    CircleStep,
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
      loaded: false,
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
      return !this.pageID && this.loaded
    },

    hasModules () {
      return !!this.modules.length
    },

    hasCharts () {
      return !!this.charts.length
    },

    hasPages () {
      return !!this.pages.filter(p => p.visible).length
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
      } else {
        this.loaded = true
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
.steps {
  padding: 0;
  padding-top: 20vh;
}
</style>
