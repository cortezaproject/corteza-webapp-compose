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

  data () {
    return {
      modules: [],
      error: null,
    }
  },

  created () {
    this.$crm.moduleList({}).then(mm => {
      this.modules = mm
    }).catch(err => {
      this.error = err
    })
  },
}
