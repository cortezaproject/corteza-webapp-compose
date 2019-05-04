<template>
  <main class="centering-wrap inactive-area">

    <h1>Compose Namespaces</h1>

    <div class="row">
      <div class="col-sm-3" v-for="(n) in namespaces" :key="n.namespaceID">
        <div class="card">
          <img class="card-img-top" :src="logo" alt="Card image cap">
          <h4 v-if="n.name" class="card-title">{{ n.name }}</h4>
          <h5 v-if="n.meta.subtitle" class="card-subtitle mb-2 text-muted">{{ n.meta.subtitle }}</h5>
          <div class="card-body" v-if="n.meta.description">
            <p class="card-text">{{ n.meta.description }}</p>
          </div>
          <div class="card-footer">
            <p class="card-text text-right">
              <router-link :to="{ name: 'pages', params: { slug: (n.slug || n.namespaceID) } }" class="btn btn-primary">{{ n.name || 'Go' }}</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>

  </main>
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
<style lang="scss" scoped>

</style>
