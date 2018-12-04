<template>
  <div class="form-group">
    {{ field.title || field.name }}
    <b-form-input
      type="date"
      v-model="value" />
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
