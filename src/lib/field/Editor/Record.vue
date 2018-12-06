<template>
  <div class="form-group">
    {{ field.label || field.name }} @todo
    <b-form-select
      disabled
      v-model="value" />
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
