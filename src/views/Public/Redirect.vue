<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PublicRedirect',

  computed: {
    ...mapGetters({
      pages: 'page/set',
    }),
  },

  beforeMount () {
    // This has to happen beforeMount() as because pages are loaded on created()
    const firstVisibleNonRecordPage = this.pages.find(p => !p.moduleID && p.visible)

    if (firstVisibleNonRecordPage) {
      this.$router.push({ name: 'page', params: { pageID: firstVisibleNonRecordPage.pageID } })
    } else {
      this.raiseWarningAlert(this.$t('notification.page.noPages'))
    }
  },

  render (h) { return null },
}
</script>
