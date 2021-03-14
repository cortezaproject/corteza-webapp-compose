<template>
  <div>
    <label v-if="!valueOnly">{{ field.label || field.name }}</label>
    <div v-if="valid">
      <div v-if="field.isMulti">
        <span v-for="(r, index) of value" :key="index">
          <span v-if="index && index !== value.length" v-html="getDelimiter" />
          <span v-if="linkToRecord(index)" @click.stop>
            <router-link :to="linkToRecord(index)">{{ format(index) }}</router-link>
          </span>
          <span v-else>
            {{ format(index) }}
          </span>
        </span>
      </div>
      <div v-else class="text-nowrap">
        <div v-if="linkToRecord()" @click.stop><router-link :to="linkToRecord()">{{ format() }}</router-link></div>
        <div v-else>{{ format() }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import base from './base'
import { compose } from '@cortezaproject/corteza-js'
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
        for (const record of this.relRecords) {
          if (!record) {
            return false
          }
        }
        return true
      }
      return false
    },

    getDelimiter () {
      if (this.field.options.multiDelimiter === '\n') {
        return '<br>'
      }
      return this.field.options.multiDelimiter
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
            return value.join(', ')
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
      if (value) {
        const { namespaceID } = this.namespace
        const { moduleID } = this.field.options
        this.findModuleByID({ namespace: this.namespace, moduleID }).then(m => {
          for (const v of value) {
            if (v) {
              let record = { recordID: v }
              this.$ComposeAPI.recordRead({ namespaceID, moduleID, recordID: v }).then(r => {
                if (r) {
                  record = r
                }
                this.relRecords.push(new compose.Record(m, record))
              }).catch(e => {
                this.relRecords.push(new compose.Record(m, record))
              })
            }
          }
        })
      }
    },
  },
}
</script>
