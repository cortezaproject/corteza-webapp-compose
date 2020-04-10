<template>
  <b-form-group
    :label="label"
    label-class="text-secondary"
    :class="formGroupStyleClasses"
  >
    <multi v-if="field.isMulti" :value.sync="value" v-slot="ctx">
      <b-form-input
        type="url"
        placeholder="Example URL: https://example.com"
        :formatter="fixUrl"
        lazy-formatter
        v-model="value[ctx.index]"
      />
    </multi>
    <template
      v-else
    >
      <b-form-input
        type="url"
        placeholder="Example URL: https://example.com"
        :formatter="fixUrl"
        lazy-formatter
        v-model="value"
      />
      <errors :errors="errors" />
    </template>
  </b-form-group>
</template>
<script>
import base from './base'
import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from '../url'

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
