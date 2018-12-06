<template>
  <div class="form-group">
    {{ field.label || field.name }}
    {{ field.options.prefix }} <b-form-input
      type="number"
      v-model="value" /> {{ field.options.suffix }}
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
