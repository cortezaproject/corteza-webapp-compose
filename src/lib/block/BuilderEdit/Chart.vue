<template>
  <fieldset class="form-group">
    <b-form-group>
      <label>Chart to display inside this block:</label>
      <b-form-select v-model="o.chartID" :options="charts" text-field="name" value-field="chartID">
        <template slot="first">
          <option disabled>Pick a chart</option>
        </template>
      </b-form-select>
    </b-form-group>
  </fieldset>
</template>
<script>
import base from './base'

export default {
  extends: base,
  name: 'Chart',

  data () {
    return {
      charts: [],
    }
  },

  beforeMount () {
    this.$crm.chartList({}).then(cc => {
      this.charts = cc
    }).catch(this.defaultErrorHandler('Could not load chart list'))
  },
}
</script>
