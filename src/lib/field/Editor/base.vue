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

export default {
  components: {
    // multi is actually used in the child components
    // eslint-disable-next-line vue/no-unused-components
    multi,
  },

  props: {
    namespace: {
      type: Object,
      required: true,
    },

    field: {
      type: Object,
      required: true,
    },

    record: {
      type: Object,
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
        this.$emit('update:record', this.record)
      },
    },

    label () {
      if (this.valueOnly) {
        return ''
      }
      return this.field.label || this.field.name
    },

    errors () {
      return this.field.validate(this.value, this.record.compareToValues[this.field.name])
    },
  },
}
</script>
