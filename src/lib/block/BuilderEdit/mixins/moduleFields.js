export default {
  computed: {
    availableFields () {
      const module = this.modules.find(m => m.moduleID === this.o.moduleID)

      if (!module) {
      // No fields available
        return []
      }

      const fields = module.fields

      if (this.options.fields) {
        // Remove selected fields
        return fields.filter(a => { return this.options.fields.findIndex(f => a.id === f.id) === -1 })
      }

      return fields
    },
  },

  watch: {
    'o.moduleID' (o, n) {
      if (o !== n) {
        this.o.fields = []
      }
    },
  },

  data () {
    return {
      modules: [],
      error: null,
    }
  },

  created () {
    this.$crm.pageList({ selfID: 0 }).then(pp => {
      // @todo extend API endpoint to support fetching only record pages
      this.$crm.moduleList({}).then(mm => {
        this.modules = mm.map(m => {
          m.recordPage = pp.find(p => p.moduleID === m.moduleID)
          return m
        })
      }).catch(err => {
        this.error = err
      })
    }).catch(err => {
      this.error = err
    })
  },
}
