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
      return this.value
    },
  },
}
</script>
