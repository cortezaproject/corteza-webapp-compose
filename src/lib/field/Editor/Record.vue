<template>
  <b-form-group :label="field.label || field.name">
    <vue-select :options="options"
                :disabled="!this.field.options.moduleID"
                @search="search"
                option-value="recordID"
                option-text="label"
                placeholder="Start typing to search for records"
                v-model="selected">
    </vue-select>
  </b-form-group>
</template>
<script>
import base from './base'
import { VueSelect } from 'vue-select'
import Record from '@/lib/record'
import Module from '@/lib//module'
import _ from 'lodash'

export default {
  extends: base,

  data () {
    return {
      module: null,
      valueRecord: {},
      records: [],
      latest: [], // set of 20 latest records for default list
      query: null,
    }
  },

  computed: {
    options () {
      return (this.query ? this.records : this.latest).map(this.convert)
    },

    selected: {
      get () {
        this.findByID(this.value)
        return this.convert(this.valueRecord)
      },

      set (v) {
        let { value } = v || {}
        if (value && value !== this.value) {
          // Set selected to value
          this.value = value

          // Find selected and copy it to so we can show it
          this.valueRecord = this.records.find(r => r.recordID === value)
        }
      },
    },
  },

  watch: {
    'field.options': {
      deep: true,
      handler () {
        // We need to daly loading for abit
        _.throttle((e) => {
          this.loadLatest()
          this.loadModule()
        }, 500)()
      },
    },
  },

  created () {
    this.loadLatest()
    this.loadModule()
  },

  methods: {
    convert (r) {
      if (!r.values) {
        return null
      }

      const value = r.recordID
      let label = value
      if (this.field.options.labelField) {
        label = r.values[this.field.options.labelField]
      }

      return { value, label }
    },

    search (query) {
      this.query = query
      const moduleID = this.field.options.moduleID

      if (moduleID && query.length > 0) {
        // Prepare query
        const filter = (this.field.options.queryFields || [this.field.options.labelField]).map(qf => {
          return `${qf} LIKE '%${query}%'`
        }).join(' OR ')

        this.$crm.moduleRecordList({ moduleID, filter, sort: this.sortString() }).then(({ records }) => {
          this.records = records.map(r => new Record(this.module, r))
        })
      }
    },

    loadLatest () {
      const moduleID = this.field.options.moduleID
      if (moduleID) {
        this.$crm.moduleRecordList({ moduleID, sort: this.sortString() }).then(({ records }) => {
          this.latest = records.map(r => new Record(this.module, r))
        })
      }
    },

    sortString () {
      return [this.field.options.labelField, 'updated_at DESC', 'created_at DESC'].filter(f => !!f).join(', ')
    },

    // Fetches record if not already present
    findByID (recordID) {
      const moduleID = this.field.options.moduleID
      if (moduleID && recordID && (this.valueRecord || {}).recordID !== recordID) {
        this.$crm.moduleRecordRead({ moduleID, recordID }).then(r => {
          this.valueRecord = new Record(this.module, r)
        })
      }
    },

    loadModule () {
      const moduleID = this.field.options.moduleID
      if (moduleID && (!this.module || this.module.moduleID !== moduleID)) {
        this.$crm.moduleRead({ moduleID }).then(m => {
          this.module = new Module(m)
        })
      }
    },
  },

  components: {
    VueSelect,
  },
}
</script>
