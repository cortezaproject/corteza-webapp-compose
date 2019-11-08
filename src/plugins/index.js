import Vue from 'vue'
import VTooltip from 'v-tooltip'
import BootstrapVue from 'bootstrap-vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import SystemAPI from 'corteza-webapp-common/src/lib/corteza-server/system'
import ComposeAPI from 'corteza-webapp-common/src/lib/corteza-server/compose'

import settings from 'corteza-webapp-common/src/plugins/settings'
import system from 'corteza-webapp-common/src/plugins/system'
import compose from 'corteza-webapp-common/src/plugins/compose'
import messaging from 'corteza-webapp-common/src/plugins/messaging'
import auth from 'corteza-webapp-common/src/plugins/auth'
import reminder from 'corteza-webapp-common/src/plugins/reminder'

Vue.use(VTooltip)
Vue.use(BootstrapVue)
Vue.use(Router)
Vue.use(Vuex)

Vue.use(settings, { api: ComposeAPI })
Vue.use(system)
Vue.use(compose)
Vue.use(messaging)
Vue.use(auth)

Vue.use(reminder, { api: SystemAPI })
