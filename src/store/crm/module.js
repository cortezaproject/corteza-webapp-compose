/* file is generated, do not modify by hand */

const state = {
  // local error state
  errors: [],

  // custom section state
  List: {},
  Create: {},
  Read: {},
  Edit: {},
  Delete: {},
}

const getters = {}

const actions = {
  async List ({ commit, query }) {
    try {
      commit('error', '')
      commit('moduleList', {})
      const response = this._vm.$crm.moduleList({ query })
      commit('moduleList', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Create ({ commit, name, fields }) {
    try {
      commit('error', '')
      commit('moduleCreate', {})
      const response = this._vm.$crm.moduleCreate({ name, fields })
      commit('moduleCreate', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Read ({ commit, id }) {
    try {
      commit('error', '')
      commit('moduleRead', {})
      const response = this._vm.$crm.moduleRead({ id })
      commit('moduleRead', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Edit ({ commit, id, name, fields }) {
    try {
      commit('error', '')
      commit('moduleEdit', {})
      const response = this._vm.$crm.moduleEdit({ id, name, fields })
      commit('moduleEdit', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Delete ({ commit, id }) {
    try {
      commit('error', '')
      commit('moduleDelete', {})
      const response = this._vm.$crm.moduleDelete({ id })
      commit('moduleDelete', response)
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
  moduleList (state, response) {
    state['List'] = response
  },
  moduleCreate (state, response) {
    state['Create'] = response
  },
  moduleRead (state, response) {
    state['Read'] = response
  },
  moduleEdit (state, response) {
    state['Edit'] = response
  },
  moduleDelete (state, response) {
    state['Delete'] = response
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
