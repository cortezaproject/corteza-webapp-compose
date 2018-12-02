<template>
  <div>
    <fieldset class="form-group">
      <label for="select-content-list">Module</label>

      <select v-model="o.moduleID" required class="form-control" id="select-content-list">
        <option disabled selected>---</option>
        <option
          v-for="module in pageModule"
          :key="module.id"
          :value="module.moduleID">
          {{ module.name }}
          </option>
      </select>
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
            <div v-for="field in availableFields" :key="field.id">{{field.title}}</div>
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

  props: {
    pageModuleID: 0,
  },

  data () {
    return {
      pageModule: [],
    }
  },

  mixins: [
    optionsSyncProp,
    moduleFieldsMixins,
  ],

  watch: {
    modules: {
      handler () {
        // on record block only allow the module to ba added which is assigned to the page
        this.pageModule = []
        this.modules.map(m => {
          if (m.moduleID === this.pageModuleID) this.pageModule.push(m)
        })
      },

      deep: true,
    },
  },
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
