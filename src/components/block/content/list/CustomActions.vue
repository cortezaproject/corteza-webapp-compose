<template>
<div class="custom-actions">
  <button class="btn btn-sm" @click="itemAction('view-item', rowData, rowIndex)">View</button>
  <button class="btn btn-sm" @click="itemAction('edit-item', rowData, rowIndex)">Edit</button>
  <button class="btn btn-sm" @click="itemAction('delete-item', rowData, rowIndex)">Delete</button>
</div>
</template>

<script>
export default {
  props: {
    rowData: {
      type: Object,
      required: true,
    },
    rowIndex: {
      type: Number,
    },
  },
  methods: {
    itemAction (action, data, index) {
      alert('todo')
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-actions button.ui.button {
  padding: 8px 8px;
}

.custom-actions button.ui.button > i.icon {
  margin: auto !important;
}
</style>
