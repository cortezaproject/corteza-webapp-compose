<template>
  <div>
    <editor-toolbar :back-link="{name: 'admin.charts'}"
                    @delete="handleDelete"
                    @save="handleSave()"
                    @saveAndClose="handleSave({ closeOnSuccess: true })">
    </editor-toolbar>
    <form @submit.prevent="handleSave" class="container well">
      <div class="row">
        <div class="col-md-12">
          <h2>Chart builder</h2>

          <fieldset v-if="modules">
            <b-form-input v-model="chart.name" placeholder="Chart name"></b-form-input>
          </fieldset>
        </div>
      </div>
      <div class="row">
        <report v-for="(report, index) in chart.config.reports"
                :report.sync="report"
                :modules="modules"
                :key="'report_'+index"></report>

        <section class="chart col-md-6">
          <b-button @click.prevent="render"
                    :disabled="!chart.isValid()"
                    class="float-right"
                    variant="blue">Load data</b-button>
          <canvas ref="chart" width="200" height="200"></canvas>
        </section>
      </div>
      <!-- not supporting multiple reports for now
      <b-button @click.prevent="chart.config.reports.push(defaultReport)"
                v-if="false"
                class="float-right">+ Add report</b-button>
      -->
    </form>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import draggable from 'vuedraggable'
import Report from '@/components/Admin/Chart/Editor/Report'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import Chart from '@/lib/chart.js'
import ChartJS from 'chart.js'
import EditorToolbar from '@/components/Admin/EditorToolbar'

const defaultReport = {
  moduleID: undefined,
  metrics: [{ field: 'count' }],
  dimensions: [{ field: 'created_at', modifier: 'MONTH' }],
}

let chartRenderer = null

export default {
  props: {
    chartID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      chart: new Chart(),
    }
  },

  watch: {
    'chart.config': {
      deep: true,
      handler: function () {
        this.updateRenderer()
      },
    },
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
    }).catch(this.defaultErrorHandler('Could not load chart'))
  },

  methods: {
    ...mapActions({
      findChartByID: 'chart/findByID',
      updateChart: 'chart/update',
      deleteChart: 'chart/delete',
    }),

    async render () {
      this.updateRenderer({ forceFetch: true })

      // Update chart data
      this.chart.fetchReports({ reporter: (r) => this.$crm.moduleRecordReport(r) }).then(({ labels, metrics }) => {
        if (labels) {
          chartRenderer.data.labels = labels
        }

        metrics.forEach((metric, index) => {
          chartRenderer.data.datasets[index].data = metric
        })

        chartRenderer.update()
      })
    },

    updateRenderer ({ forceFetch = false } = {}) {
      if (!this.chart.isValid()) {
        return
      }

      const opt = this.chart.buildOptions()

      if (!opt) {
        this.raiseWarningAlert('Could not build chart options')
      }

      let refetch = !chartRenderer || forceFetch

      if (chartRenderer) {
        // Verify if we need to reinitialize chart renderer
        if (chartRenderer.data.datasets.length !== opt.data.datasets.length) {
          chartRenderer = undefined
        }
      }

      if (!chartRenderer) {
        refetch = true
        chartRenderer = new ChartJS(this.$refs.chart.getContext('2d'), opt)
      } else {
        chartRenderer.options = opt.options
        opt.data.datasets.forEach((dataset, index) => {
          Object.assign(chartRenderer.data.datasets[index], dataset)
        })
      }

      if (refetch) {
        // Update chart data
        this.chart.fetchReports({ reporter: (r) => this.$crm.moduleRecordReport(r) }).then(({ labels, metrics }) => {
          if (labels) {
            chartRenderer.data.labels = labels
          }

          metrics.forEach((metric, index) => {
            chartRenderer.data.datasets[index].data = metric
          })
        })
      }

      chartRenderer.update()
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      let c = Object.assign({}, this.chart)
      delete (c.config.renderer.data)

      this.updateChart(c).then(() => {
        this.raiseSuccessAlert('Chart saved')
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler('Could not save this chart'))
    },

    handleDelete () {
      this.deleteChart({ chartID: this.chartID }).then(() => {
        this.raiseSuccessAlert('Chart deleted')
        this.$router.push({ name: 'admin.charts' })
      }).catch(this.defaultErrorHandler('Could not delete this chart'))
    },

    redirect () {
      this.$router.push({ name: 'admin.charts' })
    },
  },

  components: {
    Report,
    ConfirmationToggle,
    draggable,
    EditorToolbar,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

.chart {
  margin-top: 10px;
}

</style>
