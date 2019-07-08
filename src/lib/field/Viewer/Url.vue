<template>
    <span v-if="field.options.outputPlain">{{ urlValue }}</span>
    <span v-else><a :href="urlValue" target="_blank">{{ urlValue }}</a></span>
</template>
<script>
import base from './base'
import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from 'corteza-webapp-compose/src/lib/field/Url'

export default {
  extends: base,
  computed: {
    urlValue: {
      get () {
      // run through all the attributes
        var value = this.value

        return this.fixUrl(value)
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
