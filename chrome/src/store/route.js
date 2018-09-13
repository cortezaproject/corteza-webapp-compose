import Vue from 'vue'

const localStorageKey = 'crust.route'

// Initial state
const state = {
}

const storedState = JSON.parse(localStorage.getItem(localStorageKey))
if (storedState !== null && typeof storedState === 'object') {
  Object.assign(state, storedState)
} else {
  console.debug('store.router: state not found in local storage')
}

// getters
const getters = {
  route (state) {
    return (app) => state[app]
  },
}

// actions
const actions = {
  route ({ commit }, payload) {
    commit('route', payload)
  },
}

// mutations
const mutations = {
  route (state, payload) {
    Vue.set(state, payload.app, payload.route)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
