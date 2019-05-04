<template>
  <div class="centering-wrap inactive-area" v-if="$auth.is()">
    <div class="alert-holder">
      <b-alert v-for="(a,i) in alerts"
               :variant=" a.variant || 'info'"
               :key="'alert:'+i"
               :show="a.countdown"
               dismissible
               @dismiss-count-down="a.countdown=$event"
               @dismissed="alerts.splice(i, 0)">{{ a.message }}</b-alert>
    </div>
    <router-view v-if="loaded && namespace"
                 :namespace="namespace" />
    <div class="loader" v-else>
      <img :src="logo" />
    </div>
    <div class="error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'Namespace',

  props: {
    slug: {
      required: true,
      type: String,
    },
  },

  data () {
    return {
      logo: require('@/assets/images/crust-logo-with-tagline.png'),
      loaded: false,
      error: '',
      alerts: [], // { variant: 'info', message: 'foo' },
      namespace: null,
    }
  },

  watch: {
    slug: {
      immediate: true,
      handler (slug) {
        console.debug('Slug changed', { slug })
        this.$auth.check(this.$system).then(() => {
          this.$store.dispatch('namespace/load').then(() => {
            this.namespace = this.$store.getters['namespace/getByUrlPart'](slug)
          }).then(() => {
          }).catch(this.errHandler)
        }).catch(() => {
          window.location = '/auth'
        })
      },
    },

    namespace: {
      handler (namespace) {
        console.debug('Namespace changed', { namespace })

        if (!namespace) {
          return
        }

        this.loaded = false

        const p = { namespaceID: namespace.namespaceID, clear: true }

        // Preload all data we need.
        Promise.all([
          this.$store.dispatch('module/load', p)
            .catch(this.errHandler),

          this.$store.dispatch('chart/load', p)
            .catch(this.errHandler),

          this.$store.dispatch('page/load', p)
            .catch(this.errHandler),

          this.$store.dispatch('trigger/load', p)
            .catch(this.errHandler),

        ]).catch(this.errHandler).then(() => {
          console.log('loaded')
          this.loaded = true
        })
      },
    },
  },

  created () {
    this.error = ''
    this.handleAlert((alert) => this.alerts.push(alert))
  },

  methods: {
    // Error handler for Promise
    errHandler (error) {
      switch ((error.response || {}).status) {
        case 403:
          this.error = this.$t('notification.general.composeAccessNotAllowed')
      }

      return Promise.reject(error)
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/btns.scss";
@import "@/assets/sass/_0.declare.scss";

.alert-holder {
  position: absolute;
  width: 100%;
  top: 55px;

  .alert {
    z-index: 1;
    box-shadow: 0 0 2px 0 rgba($appgrey, 0.75);
  }
}

@keyframes flickerAnimation {
  0% { opacity: 0.6; }
  50% { opacity: 0.1; }
  100% { opacity: 0.6; }
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;

  img {
    align-self: center;
    opacity: 0.7;
    animation: flickerAnimation 3s infinite;
  }
}

.error {
  color: $appred;
  font-size: 24px;
  background-color: $appwhite;
  width: 100vw;
  height: 20vh;
  padding: 60px;
  position: absolute;
  top: 40vh;
  text-align: center;
}
</style>
