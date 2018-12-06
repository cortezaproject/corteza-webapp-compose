<template>
  <div class="form-group">
    <label>{{ field.label || field.name }}</label>
    <div>{{ value }}</div>
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
        // @todo handle multiple values
        if (this.record && this.record.fields) {
          return (this.record.fields.find(f => f.name === this.field.name) || {}).value
        } else {
          return undefined
        }
      },

      set (value) {
        // @todo handle multiple values
        if (!this.record) {
          this.record = {}
        }

        if (!this.record.fields) {
          this.record.fields = []
        }

        if (!this.record.fields.find(f => f.name === this.field.name)) {
          this.record.fields.push({
            name: this.field.name,
            value: value,
          })
        } else {
          this.record.fields.find(f => f.name === this.field.name).value = value
        }

        this.$emit('update:record', this.record)
      },
    },
  },
}
</script>
