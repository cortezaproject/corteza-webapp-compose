<template>
  <b-form-group>
    <b-form-checkbox v-model="value">
      {{ field.label || field.name }}
    </b-form-checkbox>
    <errors :errors="errors" />
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,

  computed: {
    value: {
      get () {
        if ([1, '1', 'true', true].includes(this.record.values[this.field.name])) {
          return true
        } else {
          return false
        }
      },

      set (value) {
        this.record.values[this.field.name] = value
      },
    },
  },
}
</script>
