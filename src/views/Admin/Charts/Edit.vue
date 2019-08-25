<template>
  <div class="mt-3">
    <b-container @submit.prevent="handleSave" tag="form" class="pb-5">
      <b-row>
        <b-col md="12">
          <b-card :title="$t('chart.edit.title')" class="mb-5">
            <export :list="[chart]" type="chart" class="float-right" slot="header"/>
              <b-row>
                <b-col md="6">
                  <fieldset v-if="modules">
                    <b-form-input v-model="chart.name" :placeholder="$t('chart.newPlaceholder')" class="mb-1"></b-form-input>
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

                  <chart-component v-if="chart"
                                   :chart="chart"
                                   :reporter="reporter"
                                   ref="chart"
                                   width="200"
                                   height="200"
                                   @error="error=$event"
                                   @updated="onUpdated" />

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
import draggable from 'vuedraggable'
import Report from 'corteza-webapp-compose/src/components/Admin/Chart/Editor/Report'
import ConfirmationToggle from 'corteza-webapp-compose/src/components/Admin/ConfirmationToggle'
import EditorToolbar from 'corteza-webapp-compose/src/components/Admin/EditorToolbar'
import Namespace from 'corteza-webapp-compose/src/lib/namespace'
import Export from 'corteza-webapp-compose/src/components/Admin/Export'
import { Chart, ChartComponent } from 'corteza-webapp-compose/src/lib/chart'

const defaultReport = {
  moduleID: undefined,
  metrics: [{ field: 'count' }],
  dimensions: [{ field: 'created_at', modifier: 'MONTH' }],
}

export default {
  components: {
    Report,
    ConfirmationToggle,
    draggable,
    EditorToolbar,
    Export,
    ChartComponent,
  },

  props: {
    namespace: {
      type: Namespace,
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
