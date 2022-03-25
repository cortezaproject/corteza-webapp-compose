<template>
  <div v-if="field.isMulti">
    <div
      v-for="(v, index) of value"
      :key="index"
    >
      <span v-if="field.options.outputPlain">{{ getUrlValue(index) }}{{ index !== value.length - 1 ? field.options.multiDelimiter : '' }}</span>
      <span
        v-else
        @click.stop
      ><a
        :href="getUrlValue(index)"
        target="_blank"
        rel="noopener noreferrer"
        @click.stop
      >{{ getUrlValue(index) }}{{ index !== value.length - 1 ? field.options.multiDelimiter : '' }}</a></span>
    </div>
  </div>
  <div v-else>
    <span v-if="field.options.outputPlain">{{ urlValue }}</span>
    <span
      v-else
      @click.stop
    ><a
      :href="urlValue"
      target="_blank"
      rel="noopener noreferrer"
    >{{ urlValue }}</a></span>
  </div>
</template>
<script>
import base from './base'
import { trimUrlFragment, trimUrlQuery, trimUrlPath, onlySecureUrl } from '../url'

export default {
  extends: base,

  computed: {
    urlValue () {
      return this.getUrlValue()
    },
  },

  methods: {
    getUrlValue (index = undefined) {
      const value = index !== undefined ? this.value[index] : this.value
      return this.fixUrl(value)
    },

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
