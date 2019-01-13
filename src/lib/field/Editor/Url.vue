<template>
  <b-form-group :label="field.label || field.name">
    <b-form-input
      type="url"
      v-model="urlValue"></b-form-input>
  </b-form-group>
</template>
<script>
import base from './base'
import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from '@/lib/field/Url'

export default {
  extends: base,
  computed: {
    urlValue: {
      get () {
        // run through all the attributes
        var value = this.value

        return this.fixUrl(value)
      },

      set (value) {
        // run through all the attributes
        this.value = this.fixUrl(value)
      },
    },
  },
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
