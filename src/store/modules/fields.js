'use strict'

const state = {
  initListError: '',
  list: [],
}

const getters = {}

// TEMP

const actions = {
  /**
     *@param {commit: any} param0
     */
  async initList ({ commit }) {
    // TODO API CALL to get json schema
    try {
      commit('setListError', '')
      const json = await this._vm.$crm.fieldList()
      commit('setList', json)
    } catch (e) {
      console.error(e)
      commit('setListError', 'Error when trying to get list of pages.')
    }
  },

}

const mutations = {
  /**
     *
     * @param {*} state
     * @param {Array} list
     */
  setList (state, list) {
    state.list = list
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setListError (state, error) {
    state.listError = error
  },

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
