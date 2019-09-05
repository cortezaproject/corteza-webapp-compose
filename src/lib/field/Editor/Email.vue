<template>
  <b-form-group :label="label">
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <b-form-input type="email" v-model="value[ctx.index]"></b-form-input>
    </multi>

    <b-form-input v-else type="email" v-model="value"></b-form-input>

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
