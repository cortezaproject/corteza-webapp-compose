<template>
  <canvas ref="chartCanvas"></canvas>
</template>
<script>
import { mapActions } from 'vuex'
import base from './base'
import ChartJS from 'chart.js'
import Chart from 'corteza-webapp-compose/src/lib/chart'

export default {
  extends: base,

  data () {
    return {
      chart: new Chart(),
      renderer: null,
    }
  },

  mounted () {
    if (!this.options.chartID) {
      return
    }

    this.findChartByID({ chartID: this.options.chartID }).then((chart) => {
      this.chart = chart

      if (!this.chart.isValid()) {
        return
      }

      const opt = this.chart.buildOptions()

      if (!opt) {
        return
      }

      this.$nextTick(() => {
        this.renderer = new ChartJS(this.$refs.chartCanvas.getContext('2d'), opt)
        const { namespaceID } = this.namespace
        this.chart.fetchReports({ reporter: (r) => this.$ComposeAPI.recordReport({ namespaceID, ...r }) }).then(({ labels, metrics }) => {
          if (labels) {
            this.renderer.data.labels = labels
          }

          metrics.forEach((metric, index) => {
            this.renderer.data.datasets[index].data = metric
          })

          this.renderer.update()
        })
      })
    }).catch(this.defaultErrorHandler(this.$t('notification.chart.loadFailed')))
  },

  methods: {
    ...mapActions({
      findChartByID: 'chart/findByID',
    }),
  },
}
</script>
