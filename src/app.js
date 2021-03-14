import Vue from 'vue'

import './config-check'
import './console-splash'

import './filters'
import './plugins'
import './mixins'
import './components'

import i18n from './i18n'
import store from './store'
import router from './router'

import { compose } from '@cortezaproject/corteza-js'
import { mixins, corredor } from '@cortezaproject/corteza-vue'

const notProduction = (process.env.NODE_ENV !== 'production')
const verboseEventbus = window.location.search.includes('verboseEventbus')

export default (options = {}) => {
  options = {
    el: '#app',
    name: 'compose',
    template: '<div v-if="loaded"><router-view/><vue-progress-bar /></div>',

    mixins: [
      mixins.corredor,
    ],

    data: () => ({ loaded: false }),

    mounted () {
      this.$Progress.finish()
    },

    async created () {
      return this.$auth.handle().then(({ accessTokenFn, user }) => {
        // Setup the progress bar
        this.$Progress.start()
        this.$router.beforeEach((to, from, next) => {
          this.$Progress.start()
          next()
        })
        this.$router.afterEach((to, from) => {
          this.$Progress.finish()
        })

        // ref to vue is needed inside compose helper
        // load and register bundle and list of client/server scripts

        const bundleLoaderOpt = {
          // Name of the bundle to load
          bundle: 'compose',

          // Debug logging
          verbose: notProduction || verboseEventbus,

          // Context for exec function (client scripts only!)
          //
          // Extended with additional helpers
          ctx: new corredor.ComposeCtx(
            {
              $invoker: this.$auth.user,
              accessToken: this.$auth.accessToken,
            },
            this,
          ),
        }

        // start workflow prompt watcher
        this.$store.dispatch('wfPrompts/watch')

        this.loadBundle(bundleLoaderOpt)
          .then(() => this.$ComposeAPI.automationList({ excludeInvalid: true }))
          .then(this.makeAutomationScriptsRegistrator(
            // compose specific handler that routes onManual events for server-scripts
            // to the proper endpoint on the API
            compose.TriggerComposeServerScriptOnManual(this.$ComposeAPI),
          ))

        this.$Settings.init({ api: this.$SystemAPI }).finally(() => {
          this.loaded = true

          // This bit removes code from the query params
          //
          // Vue router can't be used here because when on any child route there is no
          // guarantee that the route has loaded and so it may redirect us to the root page.
          //
          // @todo dig a bit deeper if there is a better vue-like solution; atm none were ok.
          const url = new URL(window.location.href)
          if (url.searchParams.get('code')) {
            url.searchParams.delete('code')
            window.location.replace(url.toString())
          }
        })
      }).catch((err) => {
        if (err instanceof Error && err.message === 'Unauthenticated') {
          // user not logged-in,
          // start with authentication flow
          this.$auth.startAuthenticationFlow()
          return
        }

        throw err
      })
    },

    router,
    store,
    i18n: i18n(),

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
