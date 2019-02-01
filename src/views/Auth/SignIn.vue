<script>
export default {
  render () { return null },
  beforeCreate () {
    // For no, we redirect directly to oidc endpoint
    // that will redirect us to satosa login screen
    window.location = this.$system.baseURL + '/oidc'
  },
}
</script>
