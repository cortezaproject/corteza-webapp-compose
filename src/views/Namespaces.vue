<template>
  <p>List of namespace</p>
</template>
<script>
export default {
  data () {
    return {
      logo: require('@/assets/images/crust-logo-with-tagline.png'),
      loaded: false,
      error: '',
      alerts: [], // { variant: 'info', message: 'foo' },
    }
  },

  created () {
    this.$auth.check(this.$system).then(() => {
      this.error = ''

      this.handleAlert((alert) => this.alerts.push(alert))

      const errHandler = (error) => {
        switch ((error.response || {}).status) {
          case 403:
            this.error = this.$t('notification.general.composeAccessNotAllowed')
        }

        return Promise.reject(error)
      }

      this.$store.dispatch('namespace/load').then((nn) => {
        console.log(nn)
        this.loaded = true
      }).catch(errHandler)

    }).catch((e) => {
      console.error(e)
      window.location = '/auth'
    })
  },
}
</script>
