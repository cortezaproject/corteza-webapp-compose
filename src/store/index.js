import Vue from 'vue'
import Vuex from 'vuex'
import ComposeAPI from '@/api/compose'
import namespace from './namespace'
import trigger from './trigger'
import module from './module'
import chart from './chart'
import page from './page'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    namespace: namespace(ComposeAPI),
    trigger: trigger(ComposeAPI),
    module: module(ComposeAPI),
    chart: chart(ComposeAPI),
    page: page(ComposeAPI),
  },
  // plugins: [createLogger()],
})

export default store
