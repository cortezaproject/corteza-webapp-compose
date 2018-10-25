import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
// import content from './crm/content'
// import module from './crm/module'
// import page from './crm/page'
import field from './crm/field'
import builder from './modules/builder'
import pages from './modules/pages'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    auth,
    builder,
    pages,
    field,
  },
  // plugins: [createLogger()],
})

export default store
