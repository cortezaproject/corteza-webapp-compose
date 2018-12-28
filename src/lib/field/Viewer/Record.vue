<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      relRecord: undefined,
    }
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

  computed: {
    formatted () {
      if (this.relRecord) {
        if (this.field.options.labelField) {
          const recordField = this.relRecord.fields.find(f => f.name === this.field.options.labelField)
          if (recordField && recordField.value) {
            return recordField.value
          }
        }

        return this.relRecord.recordID
      }
    },
  },

  methods: {
    load () {
      if (this.value && this.value !== (this.relRecord || {}).recordID) {
        this.$crm.moduleRecordRead({ moduleID: this.field.options.moduleID, recordID: this.value }).then(r => {
          this.relRecord = r
        })
      }
    },
  },
}
</script>
