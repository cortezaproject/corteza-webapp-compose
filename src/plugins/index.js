import Vue from 'vue'
import VTooltip from 'v-tooltip'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import settings from 'corteza-webapp-common/src/plugins/settings'
import reminder from 'corteza-webapp-common/src/plugins/reminder'
import { plugins } from '@cortezaproject/corteza-vue'

Vue.use(VTooltip)
Vue.use(BootstrapVue)
Vue.use(Router)
Vue.use(Vuex)

Vue.use(plugins.CortezaAPI('compose'))
Vue.use(plugins.CortezaAPI('system'))
Vue.use(plugins.CortezaAPI('messaging'))

Vue.use(plugins.EventBus())
Vue.use(plugins.UIHooks('compose'))

Vue.use(plugins.Auth(Vue.prototype.$SystemAPI))
Vue.use(settings, { api: Vue.prototype.$ComposeAPI })
Vue.use(reminder, { api: Vue.prototype.$SystemAPI })
