<template>
  <div class="form-group">
    {{ field.label || field.name }}
    <b-form-select
      :options="selectOptions"
      v-model="value" />
  </div>
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
