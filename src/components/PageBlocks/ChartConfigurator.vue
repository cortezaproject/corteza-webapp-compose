<template>
  <b-tab :title="$t('block.chart.label')">
    <fieldset class="form-group">
      <b-form-group>
        <label>{{ $t('block.chart.display') }}</label>
        <b-form-select v-model="options.chartID" :options="filterCharts()" text-field="name" value-field="chartID">
          <template slot="first">
            <option disabled>{{ $t('block.chart.pick') }}</option>
          </template>
        </b-form-select>
      </b-form-group>
    </fieldset>
  </b-tab>
</template>
<script>
import { mapGetters } from 'vuex'
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
      const rr = []
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
