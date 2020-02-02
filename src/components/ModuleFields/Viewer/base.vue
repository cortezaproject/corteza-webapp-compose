<template>
  <span v-if="valueOnly">
    <div :class="{'multiline': field.isMulti}">{{ formatted }}</div>
  </span>
  <div v-else>
    <label>{{ field.label || field.name }}</label>
    <div :class="{'multiline': field.isMulti}">{{ formatted }}</div>
  </div>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'

export default {
  props: {
    namespace: {
      type: compose.Namespace,
      required: true,
    },

    field: {
      type: compose.ModuleField,
      required: true,
    },

    record: {
      type: compose.Record,
      required: true,
    },

    valueOnly: {
      type: Boolean,
      required: false,
    },
  },

  computed: {
    value () {
      if (this.field.isSystem) {
        return this.record[this.field.name]
      }

      return this.record ? this.record.values[this.field.name] : undefined
    },

    formatted () {
      if (this.field.isMulti) {
        return this.value.join(this.field.options.multiDelimiter)
      }
      return this.value
    },
  },
}
</script>

<style>
.multiline {
  white-space: pre-line;
}
</style>
