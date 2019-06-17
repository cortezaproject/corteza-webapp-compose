<template>
  <div v-if="valid">
    <label v-if="!valueOnly">{{ $t(field.label) || field.name }}</label>
    <div v-if="linkToRecord"><router-link :to="linkToRecord">{{ formatted }}</router-link></div>
    <div v-else>{{ formatted }}</div>
  </div>
</template>
<script>
import base from './base'
import Record from '@/lib/record'
import { mapActions, mapGetters } from 'vuex'

export default {
  extends: base,

  data () {
    return {
      relRecord: undefined,
    }
  },

  computed: {
    ...mapGetters({
      pages: 'page/set',
    }),

    valid () {
      return !!this.relRecord
    },

    formatted () {
      if (this.valid) {
        if (this.field.options.labelField) {
          return this.relRecord.values[this.field.options.labelField]
        }
        return this.relRecord.recordID
      }
    },

    linkToRecord () {
      const recordPage = this.pages.find(p => p.moduleID === this.field.options.moduleID)

      if (!recordPage) {
        return null
      }

      return {
        name: 'page.record',
        params: {
          pageID: recordPage.pageID,
          recordID: this.relRecord.recordID,
        },
      }
    },
  },

  watch: {
    value () {
      this.load()
    },
  },

  mounted () {
    this.load()
  },

  updated () {
    this.load()
  },

  methods: {
    ...mapActions({
      findModuleByID: 'module/findByID',
    }),

    load () {
      if (this.value && this.value !== (this.relRecord || {}).recordID) {
        this.findModuleByID({ moduleID: this.field.options.moduleID })
          .then(m => {
            this.$ComposeAPI.recordRead({ namespaceID: m.namespaceID, moduleID: m.moduleID, recordID: this.value })
              .then(r => {
                this.relRecord = new Record(m, r)
              })
          })
      }
    },
  },
}
</script>
