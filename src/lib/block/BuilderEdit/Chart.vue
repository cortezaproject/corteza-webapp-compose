<template>
  <b-tab :title="$t('block.chart.label')">
    <fieldset class="form-group">
      <b-form-group>
        <label>{{ $t('block.chart.display') }}</label>
        <b-form-select v-model="o.chartID" :options="charts" text-field="name" value-field="chartID">
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
}
</script>
