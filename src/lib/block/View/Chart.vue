<template>
  <canvas ref="chartCanvas"></canvas>
</template>
<script>
import base from './base'
import ChartJS from 'chart.js'
import Chart from '@/lib/chart'

export default {
  extends: base,

  data () {
    return {
      chart: new Chart(),
      renderer: null,
    }
  },

  mounted () {
    this.$crm.chartRead({ chartID: this.options.chartID }).then((chart) => {
      this.chart = new Chart(chart)

      const { type, options } = this.chart.config.renderer

      this.renderer = new ChartJS(this.$refs.chartCanvas.getContext('2d'), { type, options })

      this.chart.fetchReports({ reporter: (r) => this.$crm.moduleRecordReport(r) }).then(({ data, options }) => {
        this.renderer.options = options
        this.renderer.data.labels = data.labels
        this.renderer.data.datasets = data.datasets
        this.renderer.update()
      })
    }).catch(this.defaultErrorHandler('Could not load chart'))
  },
}
</script>
