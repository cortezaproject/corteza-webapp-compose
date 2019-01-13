<template>
  <b-form-group :label="field.label || field.name" >
    <b-input-group :prepend="field.options.prefix" :append="field.options.suffix">
      <b-form-input type="number" v-model="value"></b-form-input>
    </b-input-group>
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
