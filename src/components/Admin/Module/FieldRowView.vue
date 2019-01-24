<template>
  <tr>
    <td></td>
    <td>{{ field.name }}</td>
    <td>{{ field.label }}</td>
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

<style lang="scss" scoped>
@import "@/assets/sass/_0.declare.scss";
@import "@/assets/sass/btns.scss";

tr {
  padding: 3px;
  vertical-align: middle;

  .handle {
    width: 30px;
    color: $appgrey;
    text-align: center;
    cursor: grab;
  }
}

td {
  &.type {
    width: 200px;

    select {
      width: 160px;
      display: inline-block;
    }

    button:disabled {
      color: $appgrey;
      cursor: auto;
    }
  }

  .btn-url {
    margin-left: 10px;

    &.add-new {
      display: block;
      margin: -10px 35px 20px;
    }
  }
}
</style>
