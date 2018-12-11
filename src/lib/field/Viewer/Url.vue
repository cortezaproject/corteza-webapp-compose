<template>
  <div class="form-group">
    {{ field.label || field.name }}
    <br />
    <span v-if="outputPlain">{{ urlValue }}</span>
    <span v-else><a :href="urlValue" target="_blank">{{ urlValue }}</a></span>
  </div>
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
    },
  },
  methods: {
    fixUrl (value) {
      // run through all the attributes
      if (this.trimFragment) {
        value = trimUrlFragment(value)
      }
      if (this.trimQuery) {
        value = trimUrlQuery(value)
      }
      if (this.trimPath) {
        value = trimUrlPath(value)
      }
      if (this.onlySecure) {
        value = onlySecureUrl(value)
      }

      return value
    },
  },
}
</script>
