<template>
  <div class="form-group">
    <b-form-checkbox
        value="1"
        unchecked-value=""
        v-model="value">
      {{ field.label || field.name }}
    </b-form-checkbox>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
