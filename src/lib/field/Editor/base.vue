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
    field: {
      type: Object,
      required: true,
    },

    record: {
      type: Object,
      required: true,
    },
  },

  computed: {
    value: {
      get () {
        return this.record.values[this.field.name]
      },

      set (value) {
        this.record.values[this.field.name] = value
        this.$emit('update:record', this.record)
      },
    },
  },
}
</script>
