<template>
  <div class="form-group">
    <!-- <label :for="field.name">{{field.title}}</label> -->
    <input type="email" v-model="row.fields[field.name]" class="form-control" />
  </div>
</template>

<script>
export default {
  props: {
    row: Object,
    field: Object,
  },
}
</script>
