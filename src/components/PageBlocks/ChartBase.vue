<template>
  <wrap v-bind="$props" v-on="$listeners">
    <chart-component
      v-if="chart"
      :chart="chart"
      :reporter="reporter"
    />
  </wrap>
</template>
<script>
import { mapActions } from 'vuex'
import base from './base'
import ChartComponent from '../Chart'

export default {
  components: {
    ChartComponent,
  },
  extends: base,

  data () {
    return {
      chart: null,
    }
  },

  mounted () {
    if (!this.options.chartID) {
      return
    }

    this.findChartByID({ chartID: this.options.chartID }).then((chart) => {
      this.chart = chart
    }).catch(this.defaultErrorHandler(this.$t('notification.chart.loadFailed')))
  },

  methods: {
    ...mapActions({
      findChartByID: 'chart/findByID',
    }),

    reporter (r) {
      return this.$ComposeAPI.recordReport({ namespaceID: this.namespace.namespaceID, ...r })
    },
  },
}
</script>
