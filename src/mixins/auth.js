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
      let { message = '' } = err
      this.$store.commit('auth/clean')

      if (message.includes('named cookie not present')) {
        // Nothing to report
      } else {
        this.$logger.error(err)
      }
      this.$router.push({ name: 'signin' })
    }).finally(() => {
      this.$store.commit('auth/loaded', true)
    })
  },
}
