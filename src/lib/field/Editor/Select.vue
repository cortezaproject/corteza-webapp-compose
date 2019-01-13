<template>
  <b-form-group :label="field.label || field.name">
    <b-form-select
      :options="selectOptions"
      v-model="value" />
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
