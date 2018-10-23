/* file is generated, do not modify by hand */

const state = {
  // local error state
  errors: [],

  // custom section state
  List: {},
  Type: {},
}

const getters = {}

const actions = {
  async List ({ commit }) {
    try {
      commit('error', '')
      commit('fieldList', {})
      const response = this._vm.$crm.fieldList()
      commit('fieldList', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Type ({ commit }, { id }) {
    try {
      commit('error', '')
      commit('fieldType', {})
      const response = this._vm.$crm.fieldType({ id })
      commit('fieldType', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
}

const mutations = {
  // common modifiers
  error (state, err) {
    state.errors = [err]
  },
  errors (state, errs) {
    state.errors = errs
  },

  // custom section modifiers
  fieldList (state, response) {
    state['List'] = response
  },
  fieldType (state, response) {
    state['Type'] = response
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
