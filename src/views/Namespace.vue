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
    <div class="loader" v-else></div>
    <div class="error text-danger text-center position-absolute" v-if="error">{{ error }}</div>
    <permissions-modal />
  </div>
</template>

<script>
import { PermissionsModal } from 'corteza-webapp-common/components'

export default {
  name: 'Namespace',

  components: {
    PermissionsModal,
  },

  props: {
    slug: {
      required: true,
      type: String,
    },
  },

  data () {
    return {
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
        this.$auth.check(this.$SystemAPI).then(() => {
          this.$store.dispatch('namespace/load').then(() => {
            this.namespace = this.$store.getters['namespace/getByUrlPart'](slug)
          }).catch(this.errHandler)
        }).catch(() => {
          this.$auth.open()
        })
      },
    },

    namespace: {
      handler (namespace) {
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

          // @port this t
          // this.$store.dispatch('trigger/load', p)
          //   .catch(this.errHandler),

          this.$store.dispatch('user/load')
            .catch(this.errHandler),

        ]).catch(this.errHandler).then(() => {
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
.alert-holder {
  position: absolute;
  width: 100%;
  top: 55px;

  .alert {
    z-index: 1;
    box-shadow: 0 0 2px 0 rgba($secondary, 0.75);
  }
}

.error {
  font-size: 24px;
  background-color: $white;
  width: 100vw;
  height: 20vh;
  padding: 60px;
  top: 40vh;
}
</style>
