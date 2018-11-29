export default {
  data () {
    return {
      pages: [],
      error: null,
    }
  },

  created () {
    // @todo We're assuming all record (module) pages are on root level
    //       but this might not be the case.
    //       API needs to accept extra filtering param that returns only record page
    this.$crm.pageList({}).then(mm => {
      this.pages = mm.filter(p => !!p.moduleID)
    }).catch(err => {
      this.error = err
    })
  },
}
