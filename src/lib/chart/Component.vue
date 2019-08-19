<template>
  <canvas ref="chartCanvas"></canvas>
</template>

<script>
import ChartJS from 'chart.js'

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
    chart: {
      handler: function (nv) {
        this.$nextTick(() => {
          this.updateChart()
        })
      },
      deep: true,
      immediate: true,
    },
  },

  beforeDestroy () {
    if (this.renderer) {
      this.renderer.destroy()
    }
  },

  methods: {
    updateChart () {
      try {
        this.chart.isValid()
      } catch ({ message }) {
        this.error(message)
        return
      }

      const opt = this.chart.buildOptions()
      if (!opt) {
        this.raiseWarningAlert(this.$t('notification.chart.optionsBuildFailed'))
      }
      const { type, options, data, ...rest } = opt

      const prepData = (report) => {
        this.chart.prepData(report, data)
      }

      const newRenderer = () => new ChartJS(this.$refs.chartCanvas.getContext('2d'), { type, options, data, ...rest })
      const rerender = () => {
        if (!this.renderer) {
          this.renderer = newRenderer()
        } else if (this.renderer.config.type !== type) {
          this.renderer.destroy()
          this.renderer = newRenderer()
        } else if (rest.plugins && rest.plugins.length !== this.renderer.config.plugins) {
          this.renderer.destroy()
          this.renderer = newRenderer()
        } else {
          this.renderer.options = options
          this.renderer.data = data
          this.renderer.update()
        }
      }

      this.chart.fetchReports({ reporter: this.reporter })
        .then(prepData)
        .then(rerender)
        .then(() => {
          this.error(null)
        })
        .catch(({ message }) => {
          this.error(message)
        })
        .finally(() => {
          this.$emit('updated')
        })
    },

    error (msg) {
      this.$emit('error', msg)
    },
  },
}
</script>
