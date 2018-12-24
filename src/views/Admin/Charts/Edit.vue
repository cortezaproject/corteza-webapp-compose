<template>
  <div>
    <div class="editor">
      <confirmation-toggle @confirmed="handleDelete" class="confirmation">Delete chart</confirmation-toggle>
      <button @click="redirect()" type="button" class="btn">Cancel</button>
      <button type="submit" @click.prevent="handleSave" class="btn btn-blue">Save</button>
      <button type="button" @click.prevent="handleSave({ closeOnSuccess: true })" class="btn btn-blue">Save and close</button>
    </div>

    <form @submit.prevent="handleSave" class="container">
      <div class="row">
        <div class="col-md-12 well">
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
      </div>
      <!-- not supporting multiple reports for now
      <b-button @click.prevent="chart.config.reports.push(defaultReport)"
                v-if="false"
                class="float-right">+ Add report</b-button>
      -->
    </form>
    <section class="chart">
      <b-button @click.prevent="render"
                :disabled="!chart.isValid()"
                class="float-right"
                variant="success">Render</b-button>
      <canvas ref="chart" width="200" height="200"></canvas>
      <pre>{{ chart }}</pre>
    </section>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import Report from '@/components/Admin/Chart/Editor/Report'
import ConfirmationToggle from '@/components/Admin/ConfirmationToggle'
import Field from '@/lib/field'
import Chart from '@/lib/chart.js'
import ChartJS from 'chart.js'

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

      modules: [],
    }
  },

  computed: {
    defaultReport () {
      return Object.assign({}, defaultReport)
    },
  },

  mounted () {
    this.$crm.chartRead({ chartID: this.chartID }).then((chart) => {
      this.chart = new Chart(chart)
    }).catch(this.defaultErrorHandler('Could not load chart'))

    this.$crm.moduleList({}).then(mm => {
      this.modules = mm.map(m => {
        if (!Array.isArray(m.fields)) {
          // In some cases, empty arrays are unmarshal as an empty object
          // and draggable component complains
          m.fields = []
        }

        m.fields = m.fields.map(f => new Field(f))
        return m
      })
    }).catch(this.defaultErrorHandler('Could not load module list'))
  },

  methods: {
    async render () {
      if (this.chart.config.reports.length === 0) {
        return
      }

      if (!chartRenderer) {
        const { type, options } = this.chart.config.renderer
        chartRenderer = new ChartJS(this.$refs.chart.getContext('2d'), { type, options })
      }

      this.chart.fetchReports({ reporter: (r) => this.$crm.moduleRecordReport(r) }).then((data) => {
        chartRenderer.options = this.chart.config.renderer.options
        chartRenderer.data.labels = data.labels
        chartRenderer.data.datasets = data.datasets
        chartRenderer.update()
      })
    },

    handleSave ({ closeOnSuccess = false } = {}) {
      let c = Object.assign({}, this.chart)
      delete (c.config.renderer.data)

      this.$crm.chartEdit(c).then(() => {
        this.raiseSuccessAlert('Chart saved')
        if (closeOnSuccess) {
          this.redirect()
        }
      }).catch(this.defaultErrorHandler('Could not save this chart'))
    },

    handleDelete () {
      this.$crm.chartDelete({ chartID: this.chartID }).then(() => {
        this.raiseSuccessAlert('Module deleted')
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
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

.confirmation {
  margin-right: 5px;
}

.btn-url {
  margin-left: 20px;
}

section.chart {
  margin: 50px;
}
</style>
