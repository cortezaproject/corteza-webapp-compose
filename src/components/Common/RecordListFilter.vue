<template>
  <div>
    <b-button
      :id="selectedFieldName"
      variant="link p-0 ml-1"
      :class="[inFilter ? 'text-primary' : 'text-secondary']"
    >
      <font-awesome-icon :icon="['fas', 'filter']" />
    </b-button>
    <b-tooltip
      ref="tooltip"
      custom-class="ctooltip"
      triggers="click blur"
      delay="0"
      :target="selectedFieldName"
      @show="onOpen()"
    >
      <div class='table-container py-3'>
        <table v-if="componentFilter.length">
          <template
            v-for="(filters, groupIndex) in componentFilter"
          >
            <template v-if="filters.length && !filters[0].groupCondition">
              <tr v-for="(filter, index) in filters" :key="`${groupIndex}-${index}`">
                <td style="min-width: 84px;">
                  <h6 v-if="index === 0" class="mb-0">
                    {{ $t("block.recordList.filter.where") }}
                  </h6>
                  <b-form-select
                    v-else
                    v-model="filter.condition"
                    :options="conditions"
                    size="md"
                  />
                </td>
                <td>
                  <b-form-select
                    v-model="filter.name"
                    :options="fieldOptions"
                    value-field="name"
                    text-field="label"
                    size="md"
                    @change="onChange($event,groupIndex, index)"
                  />
                </td>
                <td>
                  <b-form-select
                    v-model="filter.operator"
                    :options="getOperators(filter.kind)"
                    size="md"
                  />
                </td>
                <td class="d-inline-flex fill-available">
                  <field-editor
                    v-if="getField(filter.name)"
                    class="mb-0 filter-field-editor"
                    valueOnly
                    :field="getField(filter.name)"
                    :record="filter.record"
                    v-bind="mock"
                  />
                </td>
                <td>
                  <c-input-confirm
                    variant="link"
                    class="child-inline-flex"
                    @confirmed="deleteFilter(groupIndex, index)"
                    @canceled="$refs.btnSave.focus()"
                  />
                </td>
              </tr>

              <tr :key="'addFilter'+groupIndex">
                <td colspan="100%" class="text-left inline">
                  <b-button
                    ref="addFilter"
                    variant="link"
                    class="p-0 mr-auto inline"
                    @click="addFilter(groupIndex)"
                  >
                    {{ $t("block.recordList.filter.addFilter") }}
                  </b-button>
                </td>
              </tr>
            </template>
            <template v-else-if="filters.length">
              <tr :key="'groupCondtion'+groupIndex">
                <td colspan="100%" class="p-0 pb-1 filter-border justify-content-center">
                  <b-form-select
                    class="mr-1 w-auto mb-1"
                    v-model="filters[0].groupCondition"
                    :options="conditions"
                  />
                </td>
              </tr>
            </template>
          </template>

            <tr>
              <td colspan="100%" class="p-0 filter-border justify-content-center">
                <b-button
                  class="bg-white text-primary py-2 px-3 mb-1 border border-secondary btn-add"
                  variant="link"
                  @click="addGroup()"
                >
                  <font-awesome-icon
                  :icon="['fas', 'plus']"
                  class="h6 mb-0 "
                  />
                </b-button>
              </td>
            </tr>

        </table>

        <div ref="filter-footer" class="d-flex justify-content-end">
          <b-button ref="btnSave" class="mr-3" variant="primary" size="md" @click="onSave">
            {{ $t("general.label.save") }}
          </b-button>
        </div>
      </div>
    </b-tooltip>
  </div>
</template>
<script>
import FieldEditor from '../ModuleFields/Editor'
import { compose, validator } from '@cortezaproject/corteza-js'
export default {
  components: {
    FieldEditor,
  },
  props: {
    selectedField: {
      type: Object,
      required: true,
      default: () => {},
    },
    namespace: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    module: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    recordListFilter: {
      type: Array,
      required: true,
      default: () => [],
    },
  },

  data () {
    return {
      componentFilter: [...this.recordListFilter],

      conditions: [
        { value: 'AND', text: this.$t('block.recordList.filter.conditions.and') },
        { value: 'OR', text: this.$t('block.recordList.filter.conditions.or') },
      ],

      mock: {},
    }
  },

  computed: {
    fields () {
      return [
        ...[...this.module.fields].sort((a, b) =>
          a.label.localeCompare(b.label),
        ),
        ...this.module.systemFields(),
      ].filter(({ isMulti }) => !isMulti)
    },

    fieldOptions () {
      return this.fields.map(({ name, label }) => ({ name, label }))
    },

    inFilter () {
      return this.recordListFilter.some(f => {
        return f.some(
          ({ name }) => name === this.selectedField.name,
        )
      })
    },

    selectedFieldName () {
      return this.selectedField.name
    },
  },

  created () {
    this.mock = {
      namespace: this.namespace,
      module: this.module,
      errors: new validator.Validated(),
    }
  },

  methods: {
    onChange (selected, groupIndex, index) {
      const field = this.getField(selected)
      if (field) {
        const tempFilter = [...this.componentFilter]
        tempFilter[groupIndex][index].kind = field.kind
        tempFilter[groupIndex][index].name = field.name
        tempFilter[groupIndex][index].value = undefined
        this.componentFilter = tempFilter
      }
    },

    getOperators (kind) {
      const operators = [
        {
          value: '=',
          text: this.$t('block.recordList.filter.operators.equal'),
        },
        {
          value: '!=',
          text: this.$t('block.recordList.filter.operators.notEqual'),
        },
      ]

      if (['Number', 'DateTime'].includes(kind)) {
        return [
          ...operators,
          {
            value: '>',
            text: this.$t('block.recordList.filter.operators.greaterThan'),
          },
          {
            value: '<',
            text: this.$t('block.recordList.filter.operators.lessThan'),
          },
        ]
      } else if (['String', 'Url', 'Select', 'Email'].includes(kind)) {
        return [
          ...operators,
          {
            value: 'LIKE',
            text: this.$t('block.recordList.filter.operators.contains'),
          },
        ]
      }

      return operators
    },

    getField (name = '') {
      return name ? this.fields.find(f => f.name === name) : undefined
    },

    createDefaultFilter (condition, field) {
      return {
        condition: condition,
        name: field.name,
        operator: '=',
        value: undefined,
        kind: field.kind,
        record: new compose.Record(this.module, {}),
      }
    },

    addFilter (groupIndex) {
      this.componentFilter[groupIndex].push(this.createDefaultFilter('AND', this.selectedField))
    },

    addGroup () {
      this.componentFilter.push([{ groupCondition: 'AND' }])
      this.componentFilter.push([this.createDefaultFilter('AND', this.selectedField)])
    },

    deleteFilter (groupIndex, index) {
      this.$refs.btnSave.focus()
      this.componentFilter[groupIndex].splice(index, 1)
      if (!this.componentFilter[groupIndex].length) {
        this.componentFilter.splice(groupIndex, 1)
        if (this.componentFilter.length > 1) {
          groupIndex !== 0 ? this.componentFilter.splice(groupIndex - 1, 1) : this.componentFilter.splice(groupIndex, 1)
        }
      }
      if (!this.componentFilter.length) {
        this.componentFilter.push([this.createDefaultFilter('AND', this.selectedField)])
      }
    },

    onOpen () {
      if (this.recordListFilter.length) {
        this.componentFilter = this.recordListFilter.map(filter => {
          return filter.map(f => {
            // create record and fill its values property if value exists
            if (f.value) {
              const record = new compose.Record(this.module, {})
              record.values[f.name] = f.value
              return { ...f, record: record }
            } else if (f.name) {
              return this.createDefaultFilter('AND', this.getField(f.name))
            } else {
              return f
            }
          })
        })
      }
      if (!this.componentFilter.length) {
        this.componentFilter.push([this.createDefaultFilter('Where', this.selectedField)])
      }
    },

    onSave () {
      this.$refs.tooltip.$emit('close')
      this.$emit('filter', this.componentFilter.map(filter => {
        return filter.map(f => {
          if (f.record) {
            f.value = f.record.values[f.name]
          }
          const { record, ...r } = f
          return { ...r }
        })
      }),
      )
    },
  },
}
</script>
<style lang="scss">
.ctooltip .tooltip-inner {
  max-width: 760px;
  padding: 0;
  color: #2d2d2d;
  text-align: center;
  background: white;
  border-radius: 0.25rem;
  opacity: 1 !important;
  box-shadow: 0 3px 48px #00000026;
  font-size: 1rem;
}

.ctooltip .arrow::before {
  border-bottom-color: white;
}

.ctooltip {
  opacity: 1 !important;
}

.child-inline-flex > span {
  display: inline-flex !important;
  vertical-align: -webkit-baseline-middle;
  padding: 0;
}

.filter-field-editor {
  width: -webkit-fill-available;

  legend {
    display: none;
  }

  label {
    vertical-align: -webkit-baseline-middle;
  }
}
</style>
<style lang="scss" scoped>
.filter-border {
  background-image: linear-gradient(to left, lightgray, lightgray);
  background-repeat: no-repeat;
  background-size: 100% 1px;
  background-position: center;
}

.fill-available {
  width: -webkit-fill-available;
}

table {
  border-collapse: separate;
}

td {
  padding-bottom: 0.25rem;
  padding-right: 0.25rem;
}

td:first-of-type {
  padding-left: 1rem;
}

td:last-of-type {
  padding-right: 0.5rem;
}

.btn-add {
  font-size: 0.6rem;

  &:hover, &:active, &:focus {
    color: $secondary !important;
  }
}
</style>
