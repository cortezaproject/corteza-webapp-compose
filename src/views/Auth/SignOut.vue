<script>
import axios from 'axios'

export default {
  beforeCreate () {
    const { adtSignOutUrl } = window.CrustConfig.webapp.auth || {}
    if (adtSignOutUrl) {
      axios({ method: 'GET', withCredentials: true, url: adtSignOutUrl })
    }

    this.$system.authLogout().catch((err) => {
      this.$logger.error(err)
    }).finally(() => {
      this.$store.commit('auth/clean')
      this.$store.commit('auth/loaded', true)
    })
    this.$router.push({ name: 'signin' })
  },

  render () { return null },
}
</script>
