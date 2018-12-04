<template>
  <div class="form-group">
    <b-form-checkbox
        :value="true"
        :unchecked-value="false"
        v-model="value">
      {{ field.title || field.name }}
    </b-form-checkbox>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
