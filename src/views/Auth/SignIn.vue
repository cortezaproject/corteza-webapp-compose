<script>
export default {
  beforeCreate () {
    const { signInUrl } = window.CrustConfig.webapp.auth || {}
    window.location = signInUrl || (this.$system.baseURL + '/oidc')
  },

  render () { return null },
}
</script>
