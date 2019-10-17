<template>
  <tr>
    <td></td>
    <td>{{ field.name }}</td>
    <td>{{ field.label }}</td>
    <td>{{ field.kind }}</td>
  </tr>
</template>

<script>

export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
  },
}
</script>
