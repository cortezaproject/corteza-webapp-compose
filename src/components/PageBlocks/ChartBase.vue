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
import { NoID } from '@cortezaproject/corteza-js'

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
    const { chartID } = this.options

    if (chartID === NoID) {
      return
    }

    const { namespaceID } = this.namespace
    this.findChartByID({ chartID, namespaceID }).then((chart) => {
      this.chart = chart
    }).catch(this.defaultErrorHandler(this.$t('notification.chart.loadFailed')))
  },

  methods: {
    ...mapActions({
      findChartByID: 'chart/findByID',
    }),

    reporter (r) {
      const { namespaceID } = this.namespace
      return this.$ComposeAPI.recordReport({ namespaceID, ...r })
    },
  },
}
</script>
