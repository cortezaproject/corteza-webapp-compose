<template>
  <div>
    <fieldset class="form-group">
      <label>{{ label }}</label>
      <div>{{ value }}</div>
    </fieldset>
  </div>
</template>
<script>
import multi from './multi'
import { compose } from '@cortezaproject/corteza-js'

export default {
  components: {
    // multi is actually used in the child components
    // eslint-disable-next-line vue/no-unused-components
    multi,
  },

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

    validate: {
      type: Boolean,
      default: true,
    },

    valueOnly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    state () {
      if (!this.validate) {
        return null
      }

      return this.errors === 0
    },

    value: {
      get () {
        return this.record.values[this.field.name]
      },

      set (value) {
        this.record.values[this.field.name] = value
      },
    },

    label () {
      if (this.valueOnly) {
        return ''
      }

      return this.field.label || this.field.name
    },

    errors () {
      return [] // this.field.validate(this.value, this.record.compareToValues[this.field.name])
    },
  },
}
</script>
