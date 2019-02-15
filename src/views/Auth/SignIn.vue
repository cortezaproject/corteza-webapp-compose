<script>
export default {
  render () { return null },
  beforeCreate () {
    const { signInUrl } = window.CrustConfig.webapp.auth || {}
    window.location = signInUrl || (this.$system.baseURL + '/oidc')
  },
}
</script>
