<template>
    <fieldset class="form-group">
      <div class="fields">
        <div class="available">
          <label>Columns available </label>
          <button @click.prevent="selectedFields = [...allFields]" class="btn-url">Select all</button>
          <draggable
            class="drag-area"
            :list.sync="availableFields"
            :options="{ group: 'fields', sort: false }">
            <div v-for="field in availableFields"
                 @dblclick="selectedFields.push(field)"
                 class="field"
                 :key="field.name">
              <span v-if="field.label">{{field.label}} ({{field.name}})</span>
              <span v-else>{{field.name}}</span>
              <span class="system" v-if="field.isSystem">(system field)</span>
            </div>
          </draggable>
        </div>
        <div class="selected">
          <label>Columns selected</label>
          <button @click.prevent="selectedFields.splice(0)" class="btn-url">Unselect all</button>
          <draggable
            class="drag-area"
            :list.sync="selectedFields"
            :options="{ group:'fields' }">
            <div v-for="(field, index) in selectedFields"
                 @dblclick="selectedFields.splice(index,1)"
                 class="field"
                 :key="field.name">
              <span v-if="field.label">{{field.label}} ({{field.name}})</span>
              <span v-else>{{field.name}}</span>
              <span class="system" v-if="field.isSystem">(system field)</span>
            </div>
          </draggable>
        </div>
      </div>
      <i>Add fields by dragging or double-clicking on them. Selected fields can also be reordered</i>
    </fieldset>
</template>
<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },

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
        this.$emit('update:fields', f)
      },
    },

    allFields () {
      return [ ...this.module.fields, ...this.module.systemFields() ]
    },

    availableFields () {
      const fields = [ ...this.allFields ]

      if (this.fields.length > 0) {
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
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/_0.declare.scss";

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
    clear: both;

    button.btn-url {
      font-size: 90%;
      display: block;
      margin-top: 5px;
    }

    .drag-area {
      height: 150px;
      overflow-x: auto;
      border: 1px solid $appgrey;
      padding: 2px;
    }

    span.system {
      float: right;
      font-size: 80%;
    }
  }
}
</style>
