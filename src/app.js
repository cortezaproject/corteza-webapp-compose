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
import { mixins, corredor, components } from '@cortezaproject/corteza-vue'

const { CToaster } = components
Vue.component('c-toaster', CToaster)

const notProduction = (process.env.NODE_ENV !== 'production')
const verboseEventbus = window.location.search.includes('verboseEventbus')

export default (options = {}) => {
  options = {
    el: '#app',
    name: 'compose',
    template: `<div>
      <router-view v-if="loaded"/>
      <c-toaster
        :toasts="toasts"
        @toast-hidden="onToastHidden"
      />
    </div>`,

    mixins: [
      mixins.corredor,
    ],

    methods: {
      // Helper to get the toast's index by it's ID.
      // If not found, -1 is returned.
      findToast ({ id }) {
        return this.toasts.findIndex(t => t.id === id)
      },

      // Helper to show the requested toast.
      // Should be used on event bus handler
      showToast (t) {
        const i = this.findToast(t)
        if (i > -1) {
          return
        }

        t.options = {
          variant: 'warning',
          'no-auto-hide': true,
          solid: true,
          ...t.options,
        }

        this.toasts.push(t)
      },

      // Helper to handle post toast closed.
      // It mainly just cleans up the state.
      onToastHidden (id) {
        const i = this.findToast({ id })
        if (i > -1) {
          this.toasts.splice(i, 1)
        }
      },
    },

    data: () => ({
      loaded: false,
      toasts: [],
    }),
    created () {
      if (!this.$auth.is()) {
        this.loaded = true
        return
      }
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
            authToken: this.$auth.JWT,
          },
          this,
        ),
      }

      this.loadBundle(bundleLoaderOpt)
        .then(() => this.$ComposeAPI.automationList())
        .then(this.makeAutomationScriptsRegistrator(
          // compose specific handler that routes onManual events for server-scripts
          // to the proper endpoint on the API
          compose.TriggerComposeServerScriptOnManual(this.$ComposeAPI),
        ))

      this.$Settings.init({ api: this.$ComposeAPI }).finally(() => {
        this.loaded = true
      })

      this.$root.$on('notification.show', this.showToast)
    },

    beforeDestroy () {
      this.$root.$on('notification.show', this.showToast)
    },

    router,
    store,
    i18n: i18n(),

    // Any additional options we want to merge
    ...options,
  }

  return new Vue(options)
}
