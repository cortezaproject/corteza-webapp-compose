import Vue from 'vue'
import Vuex from 'vuex'
import CRM from '@/api/crm'
import trigger from './trigger'
import module from './module'
import chart from './chart'
import page from './page'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    trigger: trigger(CRM),
    module: module(CRM),
    chart: chart(CRM),
    page: page(CRM),
  },
  // plugins: [createLogger()],
})

export default store
