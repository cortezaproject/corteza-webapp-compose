// Initial state
const state = {
  user: null,
}

// getters
const getters = {
  isAuthenticated: (state) => !!state.user,
  user: (state) => state.user,
}

// actions
const actions = {}

// mutations
const mutations = {
  clean (state) {
    state.user = null
  },

  setUser (state, user) {
    if (user) {
      state.user = user
    }
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
