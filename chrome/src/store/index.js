import Vue from 'vue'
import Vuex from 'vuex'
import route from './route'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    route,
  },
})

export default store
