<template>
  <div class="position-relative h-100 w-100">
    <canvas
      ref="chartCanvas"
      class="p-2 mh-100 w-auto m-auto"
    />
  </div>
</template>

<script>
import { chartConstructor } from 'corteza-webapp-compose/src/lib/charts'
import ChartJS from 'chart.js'
import Funnel from 'chartjs-plugin-funnel'
import Gauge from 'chartjs-gauge'
import csc from 'chartjs-plugin-colorschemes'
import { NoID } from '@cortezaproject/corteza-js'

export default {
  i18nOptions: {
    namespaces: 'notification',
  },

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
      immediate: true,
      handler (chartID = NoID) {
        if (chartID !== NoID) {
          this.$nextTick(() => {
            this.updateChart()
          })
        }
      },
    },
  },

  mounted () {
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

        const data = await chart.fetchReports({ reporter: this.reporter })
        const options = chart.makeOptions(data)
        const plugins = chart.plugins()
        if (!options) {
          this.toastWarning(this.$t('chart.optionsBuildFailed'))
        }
        const type = chart.baseChartType(data.datasets)

        const canvas = this.$refs.chartCanvas || undefined
        if (canvas) {
          const newRenderer = () => new ChartJS(canvas.getContext('2d'), { options, plugins: [...plugins, Funnel, Gauge, csc, ChartjsChartMatrix], data, type })
          if (this.renderer) {
            this.renderer.destroy()
          }
          this.renderer = newRenderer()
        }
      } catch (e) {
        this.toastErrorHandler(this.$t('chart.optionsBuildFailed'))(e)
      }
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
