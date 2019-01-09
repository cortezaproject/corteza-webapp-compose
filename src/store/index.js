import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import trigger from './trigger'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    auth,
    trigger,
  },
  // plugins: [createLogger()],
})

export default store
