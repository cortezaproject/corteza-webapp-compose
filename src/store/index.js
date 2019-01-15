import Vue from 'vue'
import Vuex from 'vuex'
import CRM from '@/api/crm'
import auth from './auth'
import trigger from './trigger'
import module from './module'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    auth,
    trigger,
    module: module(CRM),
  },
  // plugins: [createLogger()],
})

export default store
