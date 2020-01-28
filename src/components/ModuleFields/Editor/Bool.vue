<template>
  <b-form-group>
    <b-form-checkbox v-model="value">
      {{ field.label || field.name }}
    </b-form-checkbox>
    <errors :errors="errors" />
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
