<template>
    <fieldset class="form-group">
      <div class="fields d-flex">
        <div class="available">
          <label>{{ $t('field.selector.available') }}</label>
          <b-button @click.prevent="selectedFields = [...allFields]" variant="link" class="float-right">{{ $t('field.selector.selectAll') }}</b-button>
          <draggable
            class="drag-area border"
            :list.sync="availableFields"
            :group="group"
          >
            <div v-for="field in availableFields"
                 @dblclick="selectedFields = [...selectedFields, field]"
                 class="field"
                 :key="field.name">
              <span v-if="field.label">{{ field.label }} ({{field.name}})</span>
              <span v-else>{{field.name}}</span>
              <span v-if="field.isRequired">*</span>
              <span class="system float-right" v-if="field.isSystem">{{ $t('field.selector.systemField') }}</span>
            </div>
          </draggable>
        </div>
        <div class="selected">
          <label>{{ $t('field.selector.selected') }}</label>
          <b-button @click.prevent="selectedFields = []" variant="link" class="float-right">{{ $t('field.selector.unselectAll') }}</b-button>
          <draggable
            class="drag-area border"
            v-model="selectedFields"
            :group="group"
          >
            <div v-for="(field) in selectedFields"
                 @dblclick="selectedFields = selectedFields.filter(({ name }) => field.name !== name)"
                 class="field"
                 :key="field.name">
              <span v-if="field.label">{{ field.label }} ({{field.name}})</span>
              <span v-else>{{field.name}}</span>
              <span v-if="field.isRequired">*</span>
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

    disabledTypes: {
      type: Array,
      default: () => [],
    },

    disableSystemFields: {
      type: Boolean,
      default: false,
    },

    systemFields: {
      type: Array,
      default: null,
    },

    fieldSubset: {
      type: Array,
      default: null,
    },

    group: {
      type: String,
      default: 'fields',
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
        // Needs to be done this way so it retains order of fields
        return this.fields.reduce((fields, field) => {
          field = this.allFields.find(({ name }) => name === field.name)
          if (field) {
            fields.push(field)
          }
          return fields
        }, [])
      },

      set (f) {
        this.$emit('update:fields', f)
      },
    },

    allFields () {
      let mFields = []
      if (this.fieldSubset) {
        mFields = this.module.filterFields(this.fieldSubset)
      } else {
        mFields = this.module.fields
      }

      if (this.disabledTypes.length > 0) {
        mFields = mFields.filter(({ kind }) => !this.disabledTypes.find(t => t === kind))
      }

      let sysFields = []
      if (!this.disableSystemFields) {
        sysFields = this.module.systemFields()
        if (this.systemFields) {
          sysFields = sysFields.filter(({ name }) => this.systemFields.find(sf => sf === name))
        }
      } else {
        mFields = mFields.filter(({ isSystem }) => !isSystem)
      }

      return [
        ...[...mFields].sort((a, b) => a.label.localeCompare(b.label)),
        ...sysFields,
      ]
    },

    availableFields () {
      // Remove selected fields
      return this.allFields.filter(a => !this.fields.some(f => a.name === f.name))
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
