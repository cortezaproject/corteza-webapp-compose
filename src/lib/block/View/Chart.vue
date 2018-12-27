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

      const opt = this.chart.buildOptions()

      if (!opt) {
        return
      }

      this.renderer = new ChartJS(this.$refs.chartCanvas.getContext('2d'), opt)

      this.chart.fetchReports({ reporter: (r) => this.$crm.moduleRecordReport(r) }).then(({ labels, metrics }) => {
        if (labels) {
          this.renderer.data.labels = labels
        }

        metrics.forEach((metric, index) => {
          this.renderer.data.datasets[index].data = metric
        })

        this.renderer.update()
      })
    }).catch(this.defaultErrorHandler('Could not load chart'))
  },
}
</script>
