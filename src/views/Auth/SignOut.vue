<script>
export default {
  data () {
    return {
      oidc: this.$system.baseURL() + '/oidc',
    }
  },
  mounted () {
    this.$system.authLogout().catch((err) => {
      this.$logger.error(err)
    }).finally(() => {
      this.$store.commit('auth/clean')
      this.$store.commit('auth/loaded', true)
    })
    this.$router.push({ name: 'signin' })
  },
}
</script>
