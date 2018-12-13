<script>
export default {
  name: 'PublicRedirect',

  render (h) { return null },

  created () {
    this.$crm.pageList({}).then((pp) => {
      pp = pp.filter(p => p.moduleID === '0' && p.visible)
      if (pp.length > 0) {
        this.$router.push({ name: 'public.page', params: { pageID: pp[0].pageID } })
      } else {
        this.raiseWarningAlert('No pages found')
      }
    }).catch(this.defaultErrorHandler('Could not load pages'))
  },
}
</script>
