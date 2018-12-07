<template>
    <fieldset class="form-group">
      <div class="fields">
        <div class="available">
          <label>Columns available </label>
          <button @click.prevent="selectedFields = []; selectedFields = availableFields" class="all">&raquo;</button>
          <draggable
            class="drag-area"
            :list.sync="availableFields"
            :options="{ group: 'fields', sort: false }">
            <div v-for="field in availableFields"
                 @dblclick="selectedFields.push(field)"
                 class="field"
                 :key="field.name">{{field.label || field.name}}</div>
          </draggable>
        </div>
        <div class="selected">
          <label>Columns selected</label>
          <button @click.prevent="selectedFields = []" class="all">&laquo;</button>
          <draggable
            class="drag-area"
            :list.sync="selectedFields"
            :options="{ group:'fields' }">
            <div v-for="(field, index) in selectedFields"
                 @dblclick="selectedFields.splice(index,1)"
                 class="field"
                 :key="field.name">{{field.label || field.name}}</div>
          </draggable>
        </div>
      </div>
      <i>Add fields by dragging or double-clicking on them. Available fields can also be reordered</i>
    </fieldset>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  props: {
    module: {
      type: Object,
      required: true,
    },

    fields: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      modules: [],
    }
  },

  computed: {
    selectedFields: {
      get () {
        return this.fields
      },

      set (f) {
        this.$emit('update:field', f)
      },
    },

    availableFields () {
      const fields = this.module.fields

      if (this.fields) {
        // Remove selected fields
        return fields.filter(a => { return this.fields.findIndex(f => a.name === f.name) === -1 })
      }

      return fields
    },
  },

  watch: {
    'moduleID' (o, n) {
      if (o !== n) {
        this.selectedFields = []
      }
    },
  },

  components: {
    draggable,
  },
}
</script>
<style lang="scss" scoped>
div.fields {
  display: flex;
  flex-flow: row nowrap;

  .selected .field {
    cursor: pointer;
  }

  .available .field {
    cursor: e-resize;
  }

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
