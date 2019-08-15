<template>
  <b-card header-bg-variant="white" footer-bg-variant="white">
    <b-container fluid class="p-0">
      <b-form-group>
        <label>{{ $t('block.recordList.export.selectFields') }}</label>
        <field-picker v-if="module" :module="module" :fields.sync="selectedFields" export/>
        <i>{{ $t('block.recordList.export.limitations') }}</i>
      </b-form-group>
      <b-form-group>
        <b-form-radio-group
          v-model="rangeType"
          :options="rangeTypeOptions"
          stacked />
      </b-form-group>
      <b-row no-gutters>
        <b-col cols="5">
          <b-form-group
            v-if="rangeType === 'range'"
            label-cols="5"
            :label="$t('block.recordList.export.rangeBy')">
            <b-form-select
              v-model="rangeBy"
              :options="rangeByOptions" />
          </b-form-group>
        </b-col>
      </b-row>
      <b-row v-if="rangeType === 'range'" no-gutters>
        <b-col cols="5">
          <b-form-group
            label-cols="5"
            :label="$t('block.recordList.export.dateRange')">
              <b-form-select
                v-model="range"
                :options="dateRangeOptions" />
          </b-form-group>
        </b-col>
        <b-col cols="3" class="ml-5">
          <b-form-input type="date" v-model="start" />
        </b-col>
        <b-col cols="3" class="ml-2">
          <b-form-input type="date" v-model="end" />
        </b-col>
      </b-row>
    </b-container>
    <div slot="footer" class="d-flex">
      <span class="mr-auto my-auto">{{ $t('block.recordList.export.recordCount', { count: recordCount}) }}</span>
      <b-button
        v-if="allowJSON"
        :disabled="fields.length === 0"
        @click="$emit('exportJSON', { ...fields, ...filter })"
        variant="dark"
        class="mr-2">

        {{ $t('block.recordList.export.json') }}
      </b-button>
      <b-button
        v-if="allowCSV"
        :disabled="fields.length === 0"
        @click="$emit('exportCSV', { ...fields, ...filter })"
        variant="dark">

        {{ $t('block.recordList.export.csv') }}
      </b-button>
    </div>
  </b-card>
</template>

<script>
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'
import moment from 'moment'

const disabledFileTypes = ['User', 'Record', 'File']

export default {
  components: {
    FieldPicker,
  },

  props: {
    allowJSON: {
      type: Boolean,
      default: true,
    },
    allowCSV: {
      type: Boolean,
      default: true,
    },
    module: {
      type: Object,
      required: true,
    },
    preselectedFields: {
      type: Array,
      default: () => [],
    },
    recordCount: {
      type: Number,
      required: true,
    },
    selectionType: {
      type: String,
      default: 'all',
    },
    filterRangeBy: {
      type: String,
      default: 'createdAt',
    },
    dateRange: {
      type: String,
      default: 'lastMonth',
    },
    startDate: {
      type: String,
      default: null,
    },
    endDate: {
      type: String,
      default: null,
    },
  },

  data () {
    return {

      fields: this.preselectedFields.filter(f => disabledFileTypes.indexOf(f.kind) < 0),
      filter: {
        rangeType: this.selectionType,
        rangeBy: this.filterRangeBy,
        date: {
          range: this.dateRange,
          start: this.startDate,
          end: this.endDate,
        },
      },
      rangeTypeOptions: [
        { value: 'all', text: 'Export all records' },
        { value: 'range', text: 'Set date range' },
      ],
      rangeByOptions: [
        { value: 'createdAt', text: 'Record created' },
        { value: 'updatedAt', text: 'Record updated' },
      ],
      dateRangeOptions: [
        { value: 'lastMonth', text: 'Last month' },
        { value: 'thisMonth', text: 'This month' },
        { value: 'lastWeek', text: 'Last week' },
        { value: 'thisWeek', text: 'This week' },
        { value: 'today', text: 'Today' },
        { value: 'custom', text: 'Custom' },
      ],
    }
  },

  computed: {
    selectedFields: {
      get () {
        return this.fields
      },

      set (selectedFields) {
        this.fields = selectedFields
      },
    },

    rangeBy: {
      get () {
        return this.filter.rangeBy
      },

      set (rangeBy) {
        this.filter.rangeBy = rangeBy
        this.$emit('change', this.filter)
      },
    },

    rangeType: {
      get () {
        return this.filter.rangeType
      },

      set (rangeType) {
        this.filter.rangeType = rangeType
        this.$emit('change', this.filter)
      },
    },

    range: {
      get () {
        return this.filter.date.range
      },

      set (range) {
        this.filter.date.range = range
        this.$emit('change', this.filter)
      },

    },

    start: {
      get () {
        let date = ''
        const { range } = this.filter.date
        if (range === 'custom') {
          return this.filter.date.start
        } else if (range === 'lastMonth') {
          date = moment().subtract('1', 'months').startOf('month')
        } else if (range === 'thisMonth') {
          date = moment().startOf('month')
        } else if (range === 'lastWeek') {
          date = moment().subtract('1', 'week').startOf('week')
        } else if (range === 'thisWeek') {
          date = moment().startOf('week')
        } else if (range === 'today') {
          date = moment().startOf('day')
        }
        return date.format('YYYY-MM-DD')
      },

      set (start) {
        this.filter.date.start = start
        this.filter.date.range = 'custom'
        this.$emit('change', this.filter)
      },
    },

    end: {
      get () {
        let date = ''
        const { range } = this.filter.date
        if (range === 'custom') {
          return this.filter.date.end
        } else if (range === 'lastMonth') {
          date = moment().subtract('1', 'months').endOf('month')
        } else if (range === 'thisMonth') {
          date = moment().endOf('month')
        } else if (range === 'lastWeek') {
          date = moment().subtract('1', 'week').endOf('week')
        } else if (range === 'thisWeek') {
          date = moment().endOf('week')
        } else if (range === 'today') {
          date = moment().endOf('day')
        }
        return date.format('YYYY-MM-DD')
      },

      set (end) {
        this.filter.date.end = end
        this.filter.date.range = 'custom'
        this.$emit('change', this.filter)
      },
    },
  },

  // Watchers needed for storybook
  watch: {
    preselectedFields (value) {
      this.fields = value.filter(f => disabledFileTypes.indexOf(f.kind) < 0)
    },

    selectionType (value) {
      this.filter.rangeType = value
    },

    filterRangeBy (value) {
      this.filter.rangeBy = value
    },

    dateRange (value) {
      this.filter.date.range = value
    },

    startDate (value) {
      this.filter.date.start = value
      this.filter.date.range = 'custom'
    },

    endDate (value) {
      this.filter.date.end = value
      this.filter.date.range = 'custom'
    },
  },

  created () {
    if (this.startDate || this.endDate) {
      this.filter.date.range = 'custom'
    }
  },
}
</script>
