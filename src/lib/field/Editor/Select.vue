<template>
  <b-form-group :label="field.label || field.name">
    <multi v-if="field.isMulti" :value.sync="value" :singleInput="field.options.selectType !== 'each'">
      <template v-slot:single>
        <b-form-select v-if="field.options.selectType === 'default'" @change="selectChange" :options="selectOptions" ref="singleSelect" >
          <template slot="first"><option disabled :value="undefined">{{ $t('field.kind.select.placeholder') }}</option></template>
        </b-form-select>
        <b-form-select v-if="field.options.selectType === 'multiple'" :options="selectOptions" v-model="value" :select-size="6" multiple />
      </template>
      <template v-slot:default="ctx">
        <b-form-select v-if="field.options.selectType === 'each'" :options="selectOptions" v-model="value[ctx.index]" />
        <span v-else>{{ value[ctx.index] }}</span>
      </template>
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

  methods: {
    selectChange (value) {
      this.value.push(value)
      // Reset select
      this.$refs.singleSelect.localValue = undefined
    },
  },
}
</script>
