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
import errors from './errors'
import { compose, validator } from '@cortezaproject/corteza-js'

export default {
  components: {
    // multi is used in the components that extends base
    // eslint-disable-next-line vue/no-unused-components
    multi,

    // errors is used in the components that extends base
    // eslint-disable-next-line vue/no-unused-components
    errors,
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

    errors: {
      type: validator.Validated,
      required: true,
    },

    valueOnly: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    formGroupStyleClasses () {
      return {
        required: this.field.isRequired,
      }
    },

    state () {
      if (!this.errors.valid()) {
        return null
      }

      return this.errors.valid() === true ? null : false
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
  },
}
</script>
