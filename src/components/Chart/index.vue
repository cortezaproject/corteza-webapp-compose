<template>
  <div class="w-100 h-100">
    <canvas ref="chartCanvas" class="p-2"></canvas>
  </div>
</template>

<script>
import { chartConstructor } from 'corteza-webapp-compose/src/lib/charts'
import ChartJS from 'chart.js'
import Funnel from 'chartjs-plugin-funnel'
import Gauge from 'chartjs-gauge'
import csc from 'chartjs-plugin-colorschemes'

export default {
  props: {
    chart: {
      type: Object,
      default: null,
    },
    reporter: {
      type: Function,
      default: null,
    },
  },

  data () {
    return {
      renderer: null,
    }
  },

  watch: {
    'chart.chartID': {
      handler () {
        this.$nextTick(() => {
          this.updateChart()
        })
      },
    },
  },

  mounted () {
    this.$nextTick(() => {
      this.updateChart()
    })

    this.$root.$on('chart.update', this.requestChartUpdate)
  },

  beforeDestroy () {
    if (this.renderer) {
      this.renderer.destroy()
    }
  },

  methods: {
    async updateChart () {
      const chart = chartConstructor(this.chart)

      try {
        chart.isValid()
      } catch ({ message }) {
        this.error(message)
        return
      }

      const data = await chart.fetchReports({ reporter: this.reporter })
      const options = chart.makeOptions(data)
      const plugins = chart.plugins()
      if (!options) {
        this.raiseWarningAlert(this.$t('notification.chart.optionsBuildFailed'))
      }
      const type = chart.baseChartType(data.datasets)

      const newRenderer = () => new ChartJS(this.$refs.chartCanvas.getContext('2d'), { options, plugins: [...plugins, Funnel, Gauge, csc], data, type })
      if (this.renderer) {
        this.renderer.destroy()
      }
      this.renderer = newRenderer()

      this.$emit('updated')
    },

    requestChartUpdate ({ name, handle } = {}) {
      if (!name && !handle) {
        this.$nextTick(() => this.updateChart())
      }

      if (name && this.chart && this.chart.name === name) {
        this.$nextTick(() => this.updateChart())
      }

      if (handle && this.chart && this.chart.handle === handle) {
        this.$nextTick(() => this.updateChart())
      }
    },

    error (msg) {
      /* eslint-disable no-console */
      console.error(msg)
    },
  },
}
</script>
