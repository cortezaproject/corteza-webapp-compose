import Vue from 'vue'
import VTooltip from 'v-tooltip'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import VueProgressBar from 'vue-progressbar'
import VueNativeSock from 'vue-native-websocket'
import vars from '../themes/corteza-base/variables.scss'

import { plugins, websocket } from '@cortezaproject/corteza-vue'

import pairs from './eventbus-pairs'

const notProduction = (process.env.NODE_ENV !== 'production')
const verboseUIHooks = window.location.search.includes('verboseUIHooks')
const verboseEventbus = window.location.search.includes('verboseEventbus')

Vue.use(VTooltip)
Vue.use(BootstrapVue, {
  BToast: {
    // see https://bootstrap-vue.org/docs/components/toast#comp-ref-b-toast-props
    autoHideDelay: 7000,
    toaster: 'b-toaster-bottom-right',
  },
})
Vue.use(Router)
Vue.use(Vuex)
Vue.use(VueProgressBar, {
  color: vars.primary,
  failedColor: vars.danger,
  thickness: '7px',
})

//
Vue.use(plugins.Auth(), { app: 'compose' })

Vue.use(plugins.CortezaAPI('compose'))
Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.CortezaAPI('federation'))
Vue.use(plugins.CortezaAPI('automation'))

Vue.use(plugins.EventBus(), {
  strict: notProduction,
  verbose: verboseEventbus,
  pairs,
})

Vue.use(plugins.UIHooks(), {
  app: 'compose',
  verbose: verboseUIHooks,
})

Vue.use(plugins.Settings, { api: Vue.prototype.$SystemAPI })
Vue.use(plugins.Reminder, { api: Vue.prototype.$SystemAPI })

Vue.use(VueNativeSock, websocket.endpoint(), websocket.config)
