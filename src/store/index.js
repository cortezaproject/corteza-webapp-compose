import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import builder from './modules/builder'
import modules from './modules/modules'
import pages from './modules/pages'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    builder,
    pages,
    modules,
  },
  // plugins: [createLogger()],
})

export default store
