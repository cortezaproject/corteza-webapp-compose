<template>
    <fieldset
      :disabled="disabled"
      class="form-group"
    >
      <b-form-group
        :label="searchLabel"
        class="mt-3 h5"
        label-cols="3"
      >
        <b-input-group
          class="search-input-width"
        >
          <b-input
            v-model.trim="query"
            type="search"
            :placeholder="$t('module:searchPlaceholder')"
            class="border-right-0 text-truncate"
          />
          <b-input-group-append>
            <b-input-group-text class="text-primary bg-white border-left-0">
              <font-awesome-icon
                :icon="['fas', 'search']"
              />
            </b-input-group-text>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
      <b-container
        class="px-0"
      >
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="pr-0"
          >
            <div class="d-flex">
              <label
                class="mt-1 mb-1 ml-1 text-primary"
              >
                {{ $t('selector.available') }}
              </label>
              <b-button
                variant="link"
                :class="[allSelected ? 'visible' : 'invisible']"
                class="ml-auto px-0 text-muted"
                @click.prevent="selectedFields = [...allFields]"
              >
                {{ $t('selector.selectAll') }}
              </b-button>
            </div>
            <b-list-group
              vertical
              class="overflow-auto"
            >
              <draggable
                handle=".handle"
                :disabled="disabled"
                :group="group"
                :value="filteredAvailableFields"
                :key="filteredAvailableFields.length"
                class="drag-area px-1"
              >
                <b-list-group-item
                  v-for="field in filteredAvailableFields"
                  :key="field.name"
                  @dblclick="selectField(field)"
                  class="mb-3 border rounded"
                >
                  <field-item
                    :field="field"
                    :selected-fields="selectedFields"
                    :is-selected="false"
                    @select-field="selectField"
                  />
                </b-list-group-item>
              </draggable>
            </b-list-group>
          </b-col>
          <b-col
            cols="12"
            sm="6"
            class="pl-0"
          >
            <div class="d-flex">
              <label
                class="mt-1 ml-1 mb-0 text-primary"
              >
                {{ $t('selector.selected') }}
              </label>
              <b-button
                variant="link"
                :class="[allUnselected ? 'visible' : 'invisible']"
                class="ml-auto px-0 text-muted"
                @click.prevent="selectedFields = []"
              >
                {{ $t('selector.unselectAll') }}
              </b-button>
            </div>
            <b-list-group
              vertical
              class="overflow-auto"
            >
              <draggable
                v-model="selectedFields"
                handle=".handle"
                :disabled="disabled"
                :group="group"
                class="drag-area px-1"
              >
                <b-list-group-item
                  v-for="field in filteredSelectedFields"
                  :key="field.name"
                  class="mb-3 border rounded"
                  @dblclick="unselectField(field)"
                >
                  <field-item
                    :field="field"
                    :selected-fields="selectedFields"
                    :is-selected="true"
                    @unselect-field="unselectField"
                  />
                </b-list-group-item>
              </draggable>
            </b-list-group>
          </b-col>
        </b-row>
      </b-container>
    </fieldset>
</template>
<script>
import draggable from 'vuedraggable'
import FieldItem from './FieldItem.vue'

export default {
  i18nOptions: {
    namespaces: 'field',
  },

  components: {
    draggable,
    FieldItem,
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

    disabled: {
      type: Boolean,
      default: false,
    },

    disabledTypes: {
      type: Array,
      default: () => [],
    },

    disableSystemFields: {
      type: Boolean,
      default: false,
    },

    searchLabel: {
      type: String,
      required: true,
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
      query: '',
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

    allSelected () {
      return this.availableFields.length > 0
    },

    allUnselected () {
      return this.selectedFields.length > 0
    },

    availableFields () {
      // Remove selected fields
      return this.allFields.filter(a => !this.fields.some(f => a.name === f.name))
    },

    filteredAvailableFields () {
      return this.filterFields(this.availableFields)
    },

    filteredSelectedFields () {
      return this.filterFields(this.selectedFields)
    },
  },

  watch: {
    'moduleID' (o, n) {
      if (o !== n) {
        this.selectedFields = []
      }
    },
  },

  methods: {
    filterFields (fields) {
      return fields
        .filter(f => f.name.toLowerCase().indexOf(this.query) > -1 || f.label.toLowerCase().indexOf(this.query) > -1)
    },
    selectField (field) {
      this.selectedFields = [...this.selectedFields, field]
    },
    unselectField (field) {
      this.selectedFields = this.selectedFields.filter(({ name }) => field.name !== name)
    },
  },
}
</script>
<style lang="scss" scoped>
.drag-area {
  height: 390px;
}

.handle {
  cursor: grab;
}

.search-input-width {
  width: 33%;
}
</style>
