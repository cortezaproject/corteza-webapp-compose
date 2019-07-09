import Vue from 'vue'
import VTooltip from 'v-tooltip'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import Vuex from 'vuex'

import system from 'corteza-webapp-common/src/plugins/system'
import compose from 'corteza-webapp-common/src/plugins/compose'
import messaging from 'corteza-webapp-common/src/plugins/messaging'
import auth from 'corteza-webapp-common/src/plugins/auth'

Vue.use(VTooltip)
Vue.use(BootstrapVue)
Vue.use(Router)
Vue.use(Vuex)

Vue.use(system)
Vue.use(compose)
Vue.use(messaging)
Vue.use(auth)
