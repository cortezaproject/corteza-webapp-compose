<template>
  <b-form-group :label="field.label || field.name">
    <b-form-input type="email" v-model="value"></b-form-input>
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
