<template>
  <b-form-group :label="$t(field.label) || field.name">
    <b-form-select
      :options="selectOptions"
      v-model="value" />

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,

  computed: {
    selectOptions () {
      return this.field.options.options
    },
  },
}
</script>
