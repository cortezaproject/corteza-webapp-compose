<template>
  <b-form-group>
    <b-form-checkbox
        :value="true"
        :unchecked-value="false"
        v-model="value"
        plain>
      {{ field.label || field.name }}
    </b-form-checkbox>

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
