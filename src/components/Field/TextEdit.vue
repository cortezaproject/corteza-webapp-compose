<template>
  <div class="form-group">
    <!-- <label :for="field.name">{{field.title}}</label> -->
    <input type="text" v-model="row[field.name]" class="form-control" />
  </div>
</template>

<script>
export default {
  name: 'FieldTextEdit',
  props: {
    row: Object,
    field: Object,
  },
}
</script>
