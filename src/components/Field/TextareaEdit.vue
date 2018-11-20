<template>
  <div class="form-group">
    <!-- <label :for="field.name">{{field.title}}</label> -->
    <textarea v-model="row.fields[field.name]" class="form-control" rows="5"></textarea>
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
