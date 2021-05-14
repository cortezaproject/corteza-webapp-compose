<template>
  <b-tab :title="$t('block.chart.label')">
    <b-form-group
      :label="$t('block.chart.display')"
    >
      <b-form-select
        v-model="options.chartID"
        :options="filterCharts()"
        text-field="name"
        value-field="chartID"
      />
    </b-form-group>
  </b-tab>
</template>
<script>
import { mapGetters } from 'vuex'
import { NoID } from '@cortezaproject/corteza-js'
import base from './base'

export default {
  name: 'Chart',

  extends: base,

  computed: {
    ...mapGetters({
      charts: 'chart/set',
    }),
  },

  methods: {
    filterCharts () {
      const rr = [
        { chartID: NoID, name: this.$t('block.chart.pick') },
      ]

      for (const c of this.charts) {
        try {
          c.isValid()
          rr.push(c)
        } catch (e) {}
      }
      return rr
    },
  },
}
</script>
