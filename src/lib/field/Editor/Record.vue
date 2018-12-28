<template>
  <div class="form-group">
    {{ field.label || field.name }}
    <vue-select :options="options"
                :disabled="!this.field.options.moduleID"
                @search="search"
                option-value="recordID"
                option-text="label"
                placeholder="Search for records"
                v-model="selected">
    </vue-select>
  </div>
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
    }
  },

  computed: {
    options () {
      return this.records.map(this.convert)
    },

    selected: {
      get () {
        this.findByID(this.value)
        return this.convert(this.valueRecord)
      },

      set ({ value } = {}) {
        if (value && value !== this.value) {
          // Set selected to value
          this.value = value

          // Find selected and copy it to so we can show it
          this.valueRecord = this.records.find(r => r.recordID === value)
        }
      },
    },
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
      const moduleID = this.field.options.moduleID

      if (moduleID && query.length > 0) {
        // Prepare query
        const filter = (this.field.options.queryFields || [this.field.options.labelField]).map(qf => {
          return `${qf} LIKE '${query}%'`
        }).join(' OR ')

        const sort = this.field.options.labelField || 'created_at DESC'

        this.$crm.moduleRecordList({ moduleID, filter, sort }).then(({ records }) => {
          this.records = records
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
