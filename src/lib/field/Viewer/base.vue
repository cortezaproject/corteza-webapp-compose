<template>
  <span v-if="valueOnly">
    <div>{{ formatted }}</div>
  </span>
  <div v-else>
    <label>{{ field.label || field.name }}</label>
    <div>{{ formatted }}</div>
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

    valueOnly: {
      type: Boolean,
      required: false,
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
    },

    formatted () {
      return this.value
    },
  },
}
</script>
