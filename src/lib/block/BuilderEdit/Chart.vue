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
import { mapGetters } from 'vuex'
import base from './base'

export default {
  extends: base,
  name: 'Chart',

  computed: {
    ...mapGetters({
      charts: 'chart/set',
    }),
  },
}
</script>
