<template>
  <div v-if="valid">
    <label v-if="!valueOnly">{{ field.label || field.name }}</label>
    <div v-if="field.isMulti">
      <div v-for="(r, index) of value" :key="index">
        <div v-if="linkToRecord(index)"><router-link :to="linkToRecord(index)">{{ format(index) }}</router-link></div>
        <div v-else>{{ format(index) }}</div>
      </div>
    </div>
    <div v-else>
      <div v-if="linkToRecord()"><router-link :to="linkToRecord()">{{ format() }}</router-link></div>
      <div v-else>{{ format() }}</div>
    </div>
  </div>
</template>
<script>
import base from './base'
import Record from 'corteza-webapp-compose/src/lib/record'
import { mapActions, mapGetters } from 'vuex'

export default {
  extends: base,

  data () {
    return {
      relRecords: [],
    }
  },

  computed: {
    ...mapGetters({
      pages: 'page/set',
    }),

    valid () {
      if (this.relRecords.length > 0) {
        for (let record of this.relRecords) {
          if (!record) {
            return false
          }
        }
        return true
      }
      return false
    },
  },

  mounted () {
    this.load()
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
    }),

    format (index = 0) {
      if (this.relRecords[index]) {
        let value = ''
        if (this.field.options.labelField) {
          value = this.relRecords[index].values[this.field.options.labelField]
        } else {
          value = this.relRecords[index].recordID
        }
        if (value && value.length > 0) {
          if (Array.isArray(value)) {
            return value.join(this.field.options.multiDelimiter)
          } else {
            return value
          }
        }
      }
      return null
    },

    linkToRecord (index = 0) {
      const recordPage = this.pages.find(p => p.moduleID === this.field.options.moduleID)
      const recordID = (this.relRecords[index] || {}).recordID
      if (!recordPage || !recordID) {
        return null
      }

      return {
        name: 'page.record',
        params: {
          pageID: recordPage.pageID,
          recordID: recordID,
        },
      }
    },

    load () {
      const value = this.field.isMulti ? this.value : [this.value]
      const exists = this.relRecords.find(r => r.recordID === value)
      if (value && !exists) {
        this.findModuleByID({ moduleID: this.field.options.moduleID })
          .then(m => {
            for (let v of value) {
              if (v) {
                let record = { recordID: v }
                this.$ComposeAPI.recordRead({ namespaceID: m.namespaceID, moduleID: m.moduleID, recordID: v })
                  .then(r => {
                    // In case record isn't found, this if prevents an infinite fetch loop
                    if (r) {
                      record = r
                    }
                    this.relRecords.push(new Record(m, record))
                  })
                  .catch(e => {
                    this.relRecords.push(new Record(m, record))
                  })
              }
            }
          })
      }
    },
  },
}
</script>
