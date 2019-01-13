<template>
  <b-form-group>
    <b-form-checkbox
        value="1"
        unchecked-value=""
        v-model="value"
        plain>
      {{ field.label || field.name }}
    </b-form-checkbox>
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
