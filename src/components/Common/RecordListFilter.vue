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
      <div>
        <table
          v-if="componentFilter.length"
          class="mb-2"
        >
          <tr
            v-for="(filter, index) in componentFilter"
            :key="index"
          >
            <td
              style="min-width: 84px;"
            >
              <h6
                v-if="index === 0"
                class="mb-0"
              >
                {{ $t('block.recordList.filter.where') }}
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
                :options="fields"
                value-field="name"
                text-field="label"
                size="md"
                @change="onChange($event, index)"
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
                @confirmed="deleteFilter(index)"
                @canceled="$refs.addFilter.focus()"
              />
            </td>
          </tr>
        </table>

        <div
          ref="filter-footer"
          class="d-flex align-items-center justify-content-between"
        >
          <b-button
            ref="addFilter"
            variant="link"
            class="p-0 mr-auto"
            @click="addFilter"
          >
            {{ $t('block.recordList.filter.addFilter') }}
          </b-button>
          <b-button
            variant="primary"
            size="md"
            @click="onSave"
          >
            {{ $t('general.label.save') }}
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
        { value: 'AND', text: 'AND' },
        { value: 'OR', text: 'OR' },
      ],

      mock: {},
    }
  },

  computed: {
    fields () {
      return [
        ...[...this.module.fields].sort((a, b) => a.label.localeCompare(b.label)),
        ...this.module.systemFields(),
      ].filter(({ isMulti }) => !isMulti)
    },

    inFilter () {
      return this.recordListFilter.some(({ name }) => name === this.selectedField.name)
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
    onChange (selected, index) {
      const field = this.getField(selected)
      if (field) {
        const tempFilter = [...this.componentFilter]
        tempFilter[index].kind = field.kind
        tempFilter[index].name = field.name
        tempFilter[index].value = undefined
        this.componentFilter = tempFilter
      }
    },

    getOperators (kind) {
      const operators = [
        { value: '=', text: this.$t('block.recordList.filter.operators.equal') },
        { value: '!=', text: this.$t('block.recordList.filter.operators.notEqual') },
      ]

      if (['Number', 'DateTime'].includes(kind)) {
        return [
          ...operators,
          { value: '>', text: this.$t('block.recordList.filter.operators.greaterThan') },
          { value: '<', text: this.$t('block.recordList.filter.operators.lessThan') },
        ]
      } else if (['String', 'Url', 'Select', 'Email'].includes(kind)) {
        return [
          ...operators,
          { value: 'LIKE', text: this.$t('block.recordList.filter.operators.contains') },
        ]
      }

      return operators
    },

    getField (name = '') {
      return name ? this.fields.find(f => f.name === name) : undefined
    },

    addFilter () {
      this.componentFilter.push({
        condition: 'AND',
        name: this.selectedField.name,
        operator: '=',
        value: undefined,
        kind: this.selectedField.kind,
        record: new compose.Record(this.module, {}),
      })
    },

    deleteFilter (index) {
      this.$refs.addFilter.focus()
      this.componentFilter.splice(index, 1)
    },

    onOpen () {
      if (this.recordListFilter.length) {
        this.componentFilter = this.recordListFilter.map((f) => {
          const record = new compose.Record(this.module, {})
          record.values[f.name] = f.value
          return { ...f, record: record }
        })
      } else if (this.componentFilter.length < 1) {
        this.componentFilter.push({
          condition: 'WHERE',
          name: this.selectedField.name,
          operator: '=',
          value: undefined,
          kind: this.selectedField.kind,
          record: new compose.Record(this.module, {}),
        })
      }
    },

    onSave () {
      this.$refs.tooltip.$emit('close')
      this.$emit('filter', this.componentFilter.map(f => {
        f.value = f.record.values[f.name]
        const { record, ...r } = f
        return { ...r }
      }))
    },
  },
}
</script>
<style lang="scss">
.ctooltip .tooltip-inner {
  width: 730px;
  max-width: 85vw !important;
  padding: 20px;
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
.fill-available {
  width: -webkit-fill-available;
}

table {
  border-collapse: separate;
  border-spacing: 0.25rem;
}
</style>
