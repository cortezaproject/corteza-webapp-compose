<template>
  <div>
    <fieldset class="form-group">
      <label for="select-module">Module</label>
      <select v-model="o.moduleID" required class="form-control" id="select-module">
        <option disabled selected>---</option>
        <option
          v-for="module in modules"
          :key="module.id"
          :value="module.moduleID"
        >{{ module.name }}</option>
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

    <fieldset class="form-group">
      <label for="select-page">Page</label>
      <select v-model="o.pageID" required class="form-control" id="select-page">
        <option disabled selected>---</option>
        <option
          v-for="page in pages"
          :key="page.id"
          :value="page.pageID"
        >{{ page.title }}</option>
      </select>
      <i>Page to be opened for detail record view</i>
    </fieldset>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import optionsSyncPropMixin from './mixins/optionsSyncProp'
import moduleFieldsMixin from './mixins/moduleFields.js'
import pagesMixin from './mixins/pages.js'

export default {
  name: 'RecordList',

  components: {
    draggable,
  },

  watch: {
    'o.moduleID' (o, n) {
      if (o !== n) {
        this.o.fields = []
      }
    },
  },

  mixins: [
    optionsSyncPropMixin,
    moduleFieldsMixin,
    pagesMixin,
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
