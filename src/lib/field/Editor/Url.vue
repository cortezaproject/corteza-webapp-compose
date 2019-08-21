<template>
  <b-form-group :label="field.label || field.name">
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <b-form-input
        type="url"
        placeholder="Example URL: https://example.com"
        :formatter="fixUrl"
        lazy-formatter
        v-model="value[ctx.index]"></b-form-input>
    </multi>

    <b-form-input
      v-else
      type="url"
      placeholder="Example URL: https://example.com"
      :formatter="fixUrl"
      lazy-formatter
      v-model="value"></b-form-input>

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
</template>
<script>
import base from './base'
import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from 'corteza-webapp-compose/src/lib/field/Url'

export default {
  extends: base,
  methods: {
    fixUrl (value) {
      // run through all the attributes
      if (this.field.options.trimFragment) {
        value = trimUrlFragment(value)
      }
      if (this.field.options.trimQuery) {
        value = trimUrlQuery(value)
      }
      if (this.field.options.trimPath) {
        value = trimUrlPath(value)
      }
      if (this.field.options.onlySecure) {
        value = onlySecureUrl(value)
      }

      return value
    },
  },
}
</script>
