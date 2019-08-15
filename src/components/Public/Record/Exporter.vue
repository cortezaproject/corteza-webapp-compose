<template>
  <b-container fluid>
    <b-form-group>
      <label>{{ $t('block.recordList.export.selectFields') }}</label>
      <field-picker v-if="module" :module="module" :fields.sync="fields" export/>
      <i>{{ $t('block.recordList.export.limitations') }}</i>
    </b-form-group>
    <b-form-group>
       <b-form-radio-group
          v-model="exportType"
          :options="exportTypeOptions"
          stacked />
    </b-form-group>
    <b-row no-gutters>
      <b-col cols="4">
        <b-form-group
          v-if="exportType === 'range'"
          label-cols="5"
          :label="$t('block.recordList.export.rangeBy')">
          <b-form-select
            v-model="rangeBy"
            :options="rangeByOptions" />
        </b-form-group>
      </b-col>
    </b-row>
    <b-row v-if="exportType === 'range'" no-gutters>
      <b-col cols="4">
        <b-form-group
          label-cols="5"
          :label="$t('block.recordList.export.dateRange')">
            <b-form-select
              v-model="range"
              :options="dateRangeOptions" />
        </b-form-group>
      </b-col>
      <b-col cols="2" class="ml-5">
        <b-form-input type="date" v-model="start" />
      </b-col>
      <b-col cols="2" class="ml-2">
        <b-form-input type="date" v-model="end" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'
import moment from 'moment'

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
      exportTypeOptions: [
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
    fields: {
      get () {
        return this.preselectedFields
      },

      set (fields) {
        this.$emit('update:preselectedFields', fields)
      },
    },

    rangeBy: {
      get () {
        return this.filterRangeBy
      },

      set (rangeBy) {
        this.$emit('update:filterRangeBy', rangeBy)
        this.$emit('change')
      },
    },

    exportType: {
      get () {
        return this.selectionType
      },

      set (exportType) {
        this.$emit('update:selectionType', exportType)
        this.$emit('change')
      },
    },

    range: {
      get () {
        if (this.endDate || this.startDate) {
          this.$emit('update:dateRange', 'custom')
          return 'custom'
        }
        return this.dateRange
      },

      set (range) {
        this.$emit('update:dateRange', range)
        this.$emit('change')
      },

    },

    start: {
      get () {
        let date = ''
        if (this.dateRange === 'custom') {
          return this.startDate
        } else if (this.dateRange === 'lastMonth') {
          date = moment().subtract('1', 'months').startOf('month')
        } else if (this.dateRange === 'thisMonth') {
          date = moment().startOf('month')
        } else if (this.dateRange === 'lastWeek') {
          date = moment().subtract('1', 'week').startOf('week')
        } else if (this.dateRange === 'thisWeek') {
          date = moment().startOf('week')
        } else if (this.dateRange === 'today') {
          date = moment().startOf('day')
        }
        return date.format('YYYY-MM-DD')
      },

      set (start) {
        this.$emit('update:dateRange', 'custom')
        this.$emit('update:startDate', start)
        this.$emit('change')
      },
    },

    end: {
      get () {
        let date = ''
        if (this.dateRange === 'custom') {
          return this.endDate
        } else if (this.dateRange === 'lastMonth') {
          date = moment().subtract('1', 'months').endOf('month')
        } else if (this.dateRange === 'thisMonth') {
          date = moment().endOf('month')
        } else if (this.dateRange === 'lastWeek') {
          date = moment().subtract('1', 'week').endOf('week')
        } else if (this.dateRange === 'thisWeek') {
          date = moment().endOf('week')
        } else if (this.dateRange === 'today') {
          date = moment().endOf('day')
        }
        return date.format('YYYY-MM-DD')
      },

      set (end) {
        this.$emit('update:dateRange', 'custom')
        this.$emit('update:endDate', end)
        this.$emit('change')
      },
    },
  },
}
</script>
