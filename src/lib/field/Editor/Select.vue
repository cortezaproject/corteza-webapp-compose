<template>
  <b-form-group :label="field.label || field.name">
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
          <b-form-select :options="selectOptions" v-model="value[ctx.index]" />
    </multi>

    <b-form-select
      v-else
      :options="selectOptions"
      v-model="value" />

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>
<script>
import base from './base'

export default {
  extends: base,

  computed: {
    selectOptions () {
      return this.field.options.options
    },
  },
}
</script>
