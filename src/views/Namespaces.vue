<template>
  <p>
    List of namespace {{ namespaces }}

    <router-link :to="{ name: 'pages', params: { slug: (n.slug || n.namespaceID) } }" v-for="(n) in namespaces" :key="n.namespaceID">{{ n.name }}</router-link>

    {{ error }}

    <a href="/ns/88714882739863655/admin">test</a>
  </p>
</template>
<script>
export default {
  data () {
    return {
      logo: require('@/assets/images/crust-logo-with-tagline.png'),
      loaded: false,
      error: '',
      alerts: [], // { variant: 'info', message: 'foo' },
      namespaces: [],
    }
  },

  created () {
    this.$auth.check(this.$system).then(() => {
      this.error = ''

      const errHandler = (error) => {
        switch ((error.response || {}).status) {
          case 403:
            this.error = this.$t('notification.general.composeAccessNotAllowed')
        }

        return Promise.reject(error)
      }

      this.$store.dispatch('namespace/load').then((nn) => {
        this.namespaces = nn
        this.loaded = true
      }).catch(errHandler)
    }).catch((e) => {
      window.location = '/auth'
    })
  },
}
</script>
