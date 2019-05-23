<template>
  <tr>
    <td></td>
    <td>{{ field.name }}</td>
    <td>{{ $t(field.label) }}</td>
    <td>{{ field.kind }}</td>
    <td class="text-center"></td>
    <td class="text-center"></td>
    <td class="text-center"></td>
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
