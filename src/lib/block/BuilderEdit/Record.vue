<template>
  <div>
    <fieldset class="form-group">
      <label>Module</label>
      <input v-if="module" class="form-control" type="text" v-model="module.name" readonly>
    </fieldset>
    <fieldset class="form-group">
      <div class="fields" v-if="o.moduleID">
        <div>
          <label>Columns selected</label>
          <button @click.prevent="o.fields = []" class="all">&raquo;</button>
          <draggable
            class="drag-area"
            :list.sync="o.fields"
            :options="{ group:'fields' }">
            <div v-for="field in o.fields" :key="field.id">{{field.title}}</div>
          </draggable>
        </div>
        <div>
          <label>Columns available </label>
          <button @click.prevent="o.fields = []; o.fields = availableFields" class="all">&laquo;</button>
          <draggable
            class="drag-area"
            :list.sync="availableFields"
            :options="{ group:'fields' }">
            <div v-for="field in availableFields" :key="field.id">{{field.label || field.name}}</div>
          </draggable>
        </div>
      </div>
      <i>Drag fields from available to selected to include them to list of record table columns</i>
    </fieldset>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import optionsSyncProp from './mixins/optionsSyncProp'
import moduleFieldsMixins from './mixins/moduleFields.js'

export default {
  name: 'Record',

  components: {
    draggable,
  },

  computed: {
    module () {
      return this.modules.find(m => m.moduleID === this.o.moduleID)
    },
  },

  mixins: [
    optionsSyncProp,
    moduleFieldsMixins,
  ],
}
</script>
<style lang="scss" scoped>
  div.fields {
    display: flex;
    flex-flow: row nowrap;

    & > div {
      flex: 1;
      margin: 5px;

      button.all {
        float: right;
        font-size: 80%;
      }

      .drag-area {
        height: 150px;
        overflow-x: auto;
        border: 1px solid silver;
        padding: 2px;
      }
    }
  }
</style>
