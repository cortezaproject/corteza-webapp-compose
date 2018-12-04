<template>
  <div class="form-group">
    <label>{{ field.title || field.name }}</label>
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

    value: {
      required: false,
    },
  },
}
</script>
