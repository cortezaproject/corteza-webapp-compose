import axios from 'axios'
import { encode as qsEncode } from 'querystring'

const localStorageKey = 'crust.auth'

// Initial state
const state = {
  processing: false,

  baseUrl: null,
  jwt: null,
  user: null,

  error: null,
}

const storedState = JSON.parse(localStorage.getItem(localStorageKey))
if (storedState !== null && storedState.baseUrl) {
  console.debug('Auth state loaded from localstorage, values:', storedState)

  state.baseUrl = storedState.baseUrl
  state.user = storedState.user
  state.jwt = storedState.jwt
} else {
  console.debug('Auth state not found in localstorage')
}

// getters
const getters = {
  // @todo more proper JWT validation
  isAuthenticated: (state) => state.jwt !== null && state.jwt.length > 0,
  baseUrl: (state) => state.baseUrl || 'https://api.sam.crust.kendu.si',
  jwt: (state) => state.jwt,
  user: (state) => state.user,
  error: (state) => state.error,
  processing: (state) => state.processing,
}

// actions
const actions = {
  clear ({ commit }) {
    console.debug('Cleaning & flushing state')
    commit('clean')
    commit('flush')
  },

  authenticate ({ commit }, credentials) {
    const endpoint = `${credentials.baseUrl}/auth/login`

    commit('setProcessing', true)

    axios.post(endpoint, qsEncode({ username: credentials.username, password: credentials.password })).then(({ data }) => {
      if (data.response && data.response.JWT && data.response.user) {
        commit('setError', null)
        commit('setBaseUrl', credentials.baseUrl)
        commit('setToken', data.response.JWT)
        commit('setUser', data.response.user)
      } else {
        commit('setError', data.error.message || 'Unexpected data returned')
      }
    }).catch((error) => {
      commit('setError', error || 'Protocol error')
    }).finally(() => {
      commit('setProcessing', false)
      commit('flush')
    })
  },

  create ({ commit }, info) {
    const endpoint = `${info.baseUrl}/auth/create`

    commit('setProcessing', true)

    axios.post(endpoint, qsEncode(info)).then(({ data }) => {
      if (data.response && data.response.JWT && data.response.user) {
        commit('setError', null)
        commit('setBaseUrl', info.baseUrl)
        commit('setToken', data.response.JWT)
        commit('setUser', data.response.user)
      } else {
        commit('setError', data.error.message || 'Unexpected data returned')
      }
    }).catch((error) => {
      commit('setError', error || 'Protocol error')
    }).finally(() => {
      commit('setProcessing', false)
      commit('flush')
    })
  },
}

// mutations
const mutations = {
  flush (state) {
    localStorage.setItem(localStorageKey, JSON.stringify({
      baseUrl: state.baseUrl,
      jwt: state.jwt,
      user: state.user,
    }))
  },

  clean (state) {
    state.jwt = null
    state.user = null
  },

  setProcessing (state, processing) {
    state.processing = processing
  },

  setBaseUrl (state, baseUrl) {
    state.baseUrl = baseUrl
  },

  setToken (state, token) {
    state.jwt = token
  },

  setUser (state, user) {
    state.user = user
  },

  setError (state, error) {
    state.error = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
