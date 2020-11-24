import Vue from 'vue'
import VTooltip from 'v-tooltip'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import { plugins } from '@cortezaproject/corteza-vue'

import pairs from './eventbus-pairs'

Vue.use(VTooltip)
Vue.use(BootstrapVue)
Vue.use(Router)
Vue.use(Vuex)

Vue.use(plugins.CortezaAPI('compose'))
Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.CortezaAPI('messaging'))

const notProduction = (process.env.NODE_ENV !== 'production')
const verboseUIHooks = window.location.search.includes('verboseUIHooks')
const verboseEventbus = window.location.search.includes('verboseEventbus')

Vue.use(plugins.EventBus(), {
  strict: notProduction,
  verbose: notProduction || verboseEventbus,
  pairs,
})

Vue.use(plugins.UIHooks(), {
  app: 'compose',
  verbose: notProduction || verboseUIHooks,
})

Vue.use(plugins.Auth(), { api: Vue.prototype.$SystemAPI })
Vue.use(plugins.Settings, { api: Vue.prototype.$SystemAPI })
Vue.use(plugins.Reminder, { api: Vue.prototype.$SystemAPI })
