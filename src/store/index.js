import Vue from 'vue'
import Vuex from 'vuex'

import namespace from './namespace'
import module from './module'
import page from './page'
import chart from './chart'
import user from './user'
import { store as cvStore } from '@cortezaproject/corteza-vue'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    namespace: namespace(Vue.prototype.$ComposeAPI),
    module: module(Vue.prototype.$ComposeAPI),
    page: page(Vue.prototype.$ComposeAPI),
    chart: chart(Vue.prototype.$ComposeAPI),
    user: user(Vue.prototype.$SystemAPI),
    rbac: {
      namespaced: true,
      ...cvStore.RBAC(
        Vue.prototype.$ComposeAPI,
      ),
    },
    wfPrompts: {
      namespaced: true,
      ...cvStore.wfPrompts({
        api: Vue.prototype.$AutomationAPI,
        ws: Vue.prototype.$socket,
      }),
    },
  },
})
