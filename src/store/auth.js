const localStorageKey = 'auth.user'

// Initial state
const state = {
  user: null,
}

const storedJSON = localStorage.getItem(localStorageKey)
try {
  if (storedJSON !== null) {
    const storedUser = JSON.parse(localStorage.getItem(localStorageKey))
    if (storedUser !== null) {
      console.debug(`User loaded from localstorage (key:${localStorageKey}):`, storedUser)
      state.user = storedUser
    } else {
      console.debug(`User not found in local storage (key:${localStorageKey})`)
    }
  }
} catch (e) {
  console.warn(`Failed to parse JSON (${storedJSON}) from local storage:`, e)
  console.debug(`Cleaning local storage (key:${localStorageKey})`)
  localStorage.removeItem(localStorageKey)
}

// getters
const getters = {
  isAuthenticated: (state) => !!state.user,
  user: (state) => state.user,
}

// actions
const actions = {
  clear ({ commit }) {
    commit('clean')
    commit('flush')
  },

  setUser ({ commit }, user) {
    commit('setUser', user)
    commit('flush')
  },
}

// mutations
const mutations = {
  flush (state) {
    if (state.user) {
      localStorage.setItem(localStorageKey, JSON.stringify(state.user))
    } else {
      localStorage.removeItem(localStorageKey)
    }
  },

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
