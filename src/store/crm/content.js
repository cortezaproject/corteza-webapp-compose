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
  async List ({ commit, moduleID, page, perPage }) {
    try {
      commit('error', '')
      commit('contentList', {})
      const response = this._vm.$crm.moduleContentList({ moduleID, page, perPage })
      commit('contentList', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Create ({ commit, moduleID, fields }) {
    try {
      commit('error', '')
      commit('contentCreate', {})
      const response = this._vm.$crm.moduleContentCreate({ moduleID, fields })
      commit('contentCreate', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Read ({ commit, moduleID, id }) {
    try {
      commit('error', '')
      commit('contentRead', {})
      const response = this._vm.$crm.moduleContentRead({ moduleID, id })
      commit('contentRead', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Edit ({ commit, moduleID, id, fields }) {
    try {
      commit('error', '')
      commit('contentEdit', {})
      const response = this._vm.$crm.moduleContentEdit({ moduleID, id, fields })
      commit('contentEdit', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Delete ({ commit, moduleID, id }) {
    try {
      commit('error', '')
      commit('contentDelete', {})
      const response = this._vm.$crm.moduleContentDelete({ moduleID, id })
      commit('contentDelete', response)
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
  contentList (state, response) {
    state['List'] = response
  },
  contentCreate (state, response) {
    state['Create'] = response
  },
  contentRead (state, response) {
    state['Read'] = response
  },
  contentEdit (state, response) {
    state['Edit'] = response
  },
  contentDelete (state, response) {
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
