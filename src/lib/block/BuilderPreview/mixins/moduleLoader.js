export default {
  data () {
    return {
      module: null,
      error: null,
    }
  },

  created () {
    this.$crm.moduleRead({ moduleID: this.options.moduleID }).then(m => {
      this.module = m
    }).catch(err => {
      this.error = err
    })
  },
}
