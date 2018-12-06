<template>
  <div class="form-group">
    {{ field.label || field.name }}
    <b-form-textarea
      v-if="field.options.multiLine"
      v-model="value"></b-form-textarea>
    <b-form-input
      v-else
      v-model="value"></b-form-input>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
