<template>
    <fieldset class="form-group">
      <div class="fields d-flex">
        <div class="available">
          <label>{{ $t('field.selector.available') }}</label>
          <b-button @click.prevent="selectedFields = [...allFields]" variant="link" class="float-right">{{ $t('field.selector.selectAll') }}</b-button>
          <draggable
            class="drag-area border"
            :list.sync="availableFields"
            :options="{ group: 'fields', sort: false }">
            <div v-for="field in availableFields"
                 @dblclick="selectedFields.push(field)"
                 class="field"
                 :key="field.name">
              <span v-if="field.label">{{ field.label }} ({{field.name}})</span>
              <span v-else>{{field.name}}</span>
              <span class="system float-right" v-if="field.isSystem">{{ $t('field.selector.systemField') }}</span>
            </div>
          </draggable>
        </div>
        <div class="selected">
          <label>{{ $t('field.selector.selected') }}</label>
          <b-button @click.prevent="selectedFields.splice(0)" variant="link" class="float-right">{{ $t('field.selector.unselectAll') }}</b-button>
          <draggable
            class="drag-area border"
            :list.sync="selectedFields"
            :options="{ group:'fields' }">
            <div v-for="(field, index) in selectedFields"
                 @dblclick="selectedFields.splice(index,1)"
                 class="field"
                 :key="field.name">
              <span v-if="field.label">{{ field.label }} ({{field.name}})</span>
              <span v-else>{{field.name}}</span>
              <span class="system float-right" v-if="field.isSystem">{{ $t('field.selector.systemField') }}</span>
            </div>
          </draggable>
        </div>
      </div>
      <i>{{ $t('field.selector.footnote') }}</i>
    </fieldset>
</template>
<script>
import draggable from 'vuedraggable'

const disabledFileTypes = ['User', 'Record', 'File']
const enabledSystemFields = ['createdAt', 'updatedAt']

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

    export: {
      type: Boolean,
      default: false,
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
        if (this.export) {
          return this.fields.filter(f => disabledFileTypes.indexOf(f.kind) < 0)
        }
        return this.fields
      },

      set (f) {
        this.$emit('update:fields', f)
      },
    },

    allFields () {
      if (this.export) {
        const moduleFields = this.module.fields.filter(f => disabledFileTypes.indexOf(f.kind) < 0)
        const systemFields = this.module.systemFields().filter(f => enabledSystemFields.indexOf(f.name) !== -1)
        return [ ...moduleFields, ...systemFields ]
      }
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
div.fields {
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

    button.btn-link {
      font-size: 90%;
    }

    .drag-area {
      height: 150px;
      overflow-x: auto;
      padding: 2px;
      width: 100%;
    }

    span.system {
      font-size: 80%;
    }
  }
}
</style>
