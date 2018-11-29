<template>
  <div>
    <fieldset class="form-group">
      <label for="select-content-list">Module</label>

      <select v-model="o.moduleID" required class="form-control" id="select-content-list">
        <option disabled selected>---</option>
        <option
          v-for="module in modules"
          :key="module.id"
          :value="module.moduleID"
        >{{ module.name }}</option>
      </select>

      <div class="list__fields" v-if="o.moduleID">
        <label>Columns selected</label>
        <draggable
          class="drag-area"
          :list.sync="o.fields"
          :options="{ group:'fields' }">
          <div v-for="field in o.fields" :key="field.id">{{field.title}}</div>
        </draggable>
        <label>Columns available</label>
        <draggable
          class="drag-area"
          :list.sync="availableFields"
          :options="{ group:'fields' }">
          <div v-for="field in availableFields" :key="field.id">{{field.title}}</div>
        </draggable>
        <i>Drag fields from available to selected to include them to record info page</i>
      </div>
    </fieldset>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import optionSyncProp from './mixins/optionSyncProp.js'
import moduleFieldsMixins from './mixins/moduleFields.js'

export default {
  name: 'Record',

  components: {
    draggable,
  },

  mixins: [
    optionSyncProp,
    moduleFieldsMixins,
  ],
}
</script>
<style lang="scss" scoped>
.drag-area {
  min-height: 100px;
  border: 1px solid silver;
  padding: 2px;
}
</style>
