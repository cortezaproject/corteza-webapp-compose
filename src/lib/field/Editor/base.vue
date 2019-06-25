<template>
  <div>
    <fieldset class="form-group">
      <label>{{ field.label || field.name }}</label>
      <div>{{ value }}</div>
    </fieldset>
  </div>
</template>
<script>

export default {
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

    errors () {
      return this.field.validate(this.record.values[this.field.name])
    },
  },
}
</script>
