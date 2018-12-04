<template>
  <div class="form-group">
    {{ field.title || field.name }}
    <b-form-textarea
      :rows="3"
      v-model="value" />
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
