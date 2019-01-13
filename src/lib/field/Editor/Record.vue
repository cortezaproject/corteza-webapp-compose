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

export default {
  extends: base,

  data () {
    return {
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
        this.loadLatest()
      },
    },
  },

  created () {
    this.loadLatest()
  },

  methods: {
    convert (r) {
      if (!r.fields) {
        return null
      }

      const value = r.recordID
      let label = value
      if (this.field.options.labelField) {
        const recordField = r.fields.find(f => f.name === this.field.options.labelField)
        if (recordField && recordField.value) {
          label = recordField.value
        }
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

        const sort = [this.field.options.labelField, 'updated_at DESC', 'created_at DESC'].join(', ')

        this.$crm.moduleRecordList({ moduleID, filter, sort }).then(({ records }) => {
          this.records = records
        })
      }
    },

    loadLatest () {
      const moduleID = this.field.options.moduleID
      if (moduleID) {
        const sort = [this.field.options.labelField, 'updated_at DESC', 'created_at DESC'].join(', ')

        this.$crm.moduleRecordList({ moduleID, sort }).then(({ records }) => {
          this.latest = records
        })
      }
    },

    // Fetches record if not already present
    findByID (recordID) {
      const moduleID = this.field.options.moduleID
      if (moduleID && recordID && (this.valueRecord || {}).recordID !== recordID) {
        this.$crm.moduleRecordRead({ moduleID, recordID }).then(record => {
          this.valueRecord = record
        })
      }
    },
  },

  components: {
    VueSelect,
  },
}
</script>
