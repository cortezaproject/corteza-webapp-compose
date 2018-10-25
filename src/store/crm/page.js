/* file is generated, do not modify by hand */

const state = {
  // local error state
  errors: [],

  // custom section state
  List: {},
  Create: {},
  Read: {},
  Edit: {},
  Reorder: {},
  Delete: {},
}

const getters = {}

const actions = {
  async List ({ commit }, { selfID }) {
    try {
      commit('error', '')
      commit('pageList', {})
      const response = this._vm.$crm.pageList({ selfID })
      commit('pageList', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Create ({ commit }, { selfID, moduleID, title, description, visible, blocks }) {
    try {
      commit('error', '')
      commit('pageCreate', {})
      const response = this._vm.$crm.pageCreate({ selfID, moduleID, title, description, visible, blocks })
      commit('pageCreate', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Read ({ commit }, { id }) {
    try {
      commit('error', '')
      commit('pageRead', {})
      const response = this._vm.$crm.pageRead({ id })
      commit('pageRead', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Edit ({ commit }, { id, selfID, moduleID, title, description, visible, blocks }) {
    try {
      commit('error', '')
      commit('pageEdit', {})
      const response = this._vm.$crm.pageEdit({ id, selfID, moduleID, title, description, visible, blocks })
      commit('pageEdit', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Reorder ({ commit }, { selfID, pageIDs }) {
    try {
      commit('error', '')
      commit('pageReorder', {})
      const response = this._vm.$crm.pageReorder({ selfID, pageIDs })
      commit('pageReorder', response)
    } catch (e) {
      commit('error', e.message)
      throw e
    }
  },
  async Delete ({ commit }, { id }) {
    try {
      commit('error', '')
      commit('pageDelete', {})
      const response = this._vm.$crm.pageDelete({ id })
      commit('pageDelete', response)
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
  pageList (state, response) {
    state['List'] = response
  },
  pageCreate (state, response) {
    state['Create'] = response
  },
  pageRead (state, response) {
    state['Read'] = response
  },
  pageEdit (state, response) {
    state['Edit'] = response
  },
  pageReorder (state, response) {
    state['Reorder'] = response
  },
  pageDelete (state, response) {
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
