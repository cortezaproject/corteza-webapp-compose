import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters({
      isAuthenticated: 'auth/isAuthenticated',
      currentUser: 'auth/user',
      authLoaded: 'auth/loaded',
    }),
  },
  beforeCreate () {
    if (this.authLoaded) {
      return
    }
    this.$system.authCheck().then((check) => {
      this.$store.commit('auth/setUser', check.user)
    }).catch((err) => {
      this.$store.commit('auth/clean')
      this.$logger.error(err)
      this.$router.push({ name: 'signin' })
    }).finally(() => {
      this.$store.commit('auth/loaded', true)
    })
  },
}
