<template>
  <div class="mt-3 w-100 pb-5 vh-100 overflow-auto flex-grow-1">
    <b-container @submit.prevent="handleSave" tag="form" class="pb-5">
      <b-row class="pb-5">
        <b-col md="12">
          <b-card :title="$t('chart.edit.title')" class="mb-5">
            <export :list="[chart]" type="chart" class="float-right" slot="header"/>
              <b-row>
                <b-col md="6">
                  <fieldset v-if="modules">
                    <b-form-input v-model="chart.name" :placeholder="$t('chart.newPlaceholder')" class="mb-1"></b-form-input>
                    <b-form-input v-model="chart.handle" :placeholder="$t('general.placeholder.handle')" :state="handleState" class="mb-1"></b-form-input>
                  </fieldset>
                  <report v-for="(report, index) in chart.config.reports"
                          :report.sync="report"
                          :modules="modules"
                          :key="'report_'+index"></report>
                </b-col>

                <b-col md="6">
                  <b-button v-if="!error"
                            @click.prevent="update"
                            :disabled="processing"
                            class="float-right"
                            variant="outline-primary">{{ $t('chart.edit.loadData') }}</b-button>
                  <b-alert :show="error"
                           variant="warning">

                    {{ error }}
                  </b-alert>

                  <div class="chart-preview w-100 h-100">
                    <chart-component v-if="chart"
                                     :chart="chart"
                                     :reporter="reporter"
                                     ref="chart"
                                     width="200"
                                     height="200"
                                     @error="error=$event"
                                     @updated="onUpdated" />

                  </div>

                  <!-- not supporting multiple reports for now
<b-button @click.prevent="chart.config.reports.push(defaultReport)"
          v-if="false"
          class="float-right">+ Add report</b-button>
-->
                </b-col>
              </b-row>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
    <editor-toolbar :back-link="{name: 'admin.charts'}"
                    :hideDelete="!chart.canDeleteChart"
                    :hideSave="!chart.canUpdateChart"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import Report from 'corteza-webapp-compose/src/components/Admin/Chart/Editor/Report'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import { compose } from '@cortezaproject/corteza-js'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'
import { Chart, ChartComponent } from 'corteza-webapp-compose/src/lib/chart'
import { handleState } from 'corteza-webapp-compose/src/lib/handle'

const defaultReport = {
  moduleID: undefined,
  metrics: [{ field: 'count' }],
  dimensions: [{ field: 'created_at', modifier: 'MONTH' }],
}

export default {
  components: {
    Report,
    EditorToolbar,
    Export,
    ChartComponent,
  },

  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    chartID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      chart: new Chart(),
      error: null,
      processing: false,
    }
  },

  computed: {
    ...mapGetters({
      modules: 'module/set',
    }),

    defaultReport () {
      return Object.assign({}, defaultReport)
    },

    handleState () {
      return handleState(this.page)
    },
  },

  mounted () {
    this.findChartByID({ chartID: this.chartID }).then((chart) => {
      // Make a copy so that we do not change store item by ref
      this.chart = new Chart({ ...chart })
    }).catch(this.defaultErrorHandler(this.$t('notification.chart.loadFailed')))
  },

  methods: {
    ...mapActions({
      findChartByID: 'chart/findByID',
      updateChart: 'chart/update',
      deleteChart: 'chart/delete',
    }),

    reporter (r) {
      return this.$ComposeAPI.recordReport({ namespaceID: this.namespace.namespaceID, ...r })
    },

    update () {
      this.processing = true
      this.$refs.chart.updateChart()
    },

    onUpdated () {
      this.processing = false
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      let c = Object.assign({}, this.chart)
      delete (c.config.renderer.data)

      this.updateChart(c).then((chart) => {
        this.chart = new Chart(chart)
        this.raiseSuccessAlert(this.$t('notification.chart.saved'))
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler(this.$t('notification.chart.saveFailed')))
    },

    handleDelete () {
      this.deleteChart(this.chart).then(() => {
        this.raiseSuccessAlert(this.$t('notification.chart.deleted'))
        this.$router.push({ name: 'admin.charts' })
      }).catch(this.defaultErrorHandler(this.$t('notification.chart.deleteFailed')))
    },

    redirect () {
      this.$router.push({ name: 'admin.charts' })
    },
  },
}
</script>
<style lang="scss" scoped>
.chart-preview {
  max-height: 50vh;
}

</style>
