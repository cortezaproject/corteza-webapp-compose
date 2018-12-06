<template>
  <div class="form-group">
    {{ field.label || field.name }}
    <b-form-input
      type="url"
      v-model="value"></b-form-input>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
