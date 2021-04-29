<template>
  <b-form-group>
    <b-form-checkbox v-model="value">
      {{ field.label || field.name }}
      <hint
        :text="hint"
        :id="field.fieldID"
        class="d-inline-block text-primary"
      />
    </b-form-checkbox>
    <small
      class="form-text font-weight-light text-muted"
    >
      {{ description }}
    </small>
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
        if (this.record.values[this.field.name]) {
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
