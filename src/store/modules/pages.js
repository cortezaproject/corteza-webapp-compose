'use strict'

import Vue from 'vue'

const state = {
  initListError: '',
  list: [],
  addPageFormData: {
    name: '',
  },
  addPageFormSubmitError: '',
  deleteError: '',
  deletePageError: '',
  deletePageId: '',
  initEditPageError: '',
  editPageFormData: {
    name: '',
  },
  editPageFormSubmitError: '',
}

const getters = {}

// TEMP

const actions = {
  /**
     * @param {commit: any, state: any} param0
     */
  async handleAddPageFormSubmit ({ commit, state }) {
    try {
      commit('setAddPageFormSubmitError', '')
      const page = await this._vm.$crm.pageCreate(state.addPageFormData.name)
      commit('resetAddPageFormData')
      commit('addPageToList', page)
    } catch (e) {
      console.error(e)
      commit('setAddPageFormSubmitError', 'Error when trying to create page.')
    }
  },

  /**
     *@param {commit: any} param0
     */
  async initList ({ commit }) {
    // TODO API CALL to get json schema
    try {
      console.log(this)
      console.log(Vue)
      commit('setListError', '')
      const json = await this._vm.$crm.pageList()
      commit('setList', json)
    } catch (e) {
      console.error(e)
      commit('setListError', 'Error when trying to get list of pages.')
    }
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async initEditPageFormData ({ commit }, id) {
    // TODO API CALL to get json schema
    try {
      commit('setEditPageFormDataError', '')
      const json = await this._vm.$crm.pageRead(id)
      commit('setEditPageFormData', json)
    } catch (e) {
      console.error(e)
      commit('setEditPageFormDataError', 'Error when trying to init page form.')
    }
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async deletePage ({ commit }, id) {
    try {
      commit('setDeletePageError', '')
      await this._vm.$crm.pageDelete(id)
      commit('deletePageFromList', id)
    } catch (e) {
      console.error(e)
      commit('setDeletePageError', 'Error when trying to delete page.')
    }
  },

  /**
     * @param {commit: any, state: any} param0
     */
  async handleEditPageFormSubmit ({ commit, state }) {
    try {
      commit('setEditPageFormSubmitError', '')
      await this._vm.$crm.pageEdit(state.editPageFormData.id, state.editPageFormData.name)
      commit('resetEditPageFormData')
    } catch (e) {
      console.error(e)
      commit('setEditPageFormSubmitError', 'Error when trying to edit page.')
    }
  },
}

const mutations = {
  /**
     *
     * @param {*} state
     * @param {*} newValue
     */
  setAddPageFormData (state, newValue) {
    state.addPageFormData = newValue
  },

  /**
     *
     * @param {*} state
     * @param {*} newValue
     */
  setEditPageFormData (state, newValue) {
    console.log(JSON.stringify(state.editPageFormData))
    console.log(newValue)
    state.editPageFormData = newValue
  },

  /**
     *
     * @param {*} state
     */
  resetAddPageFormData (state) {
    state.addPageFormData = {}
  },

  /**
     *
     * @param {*} state
     */
  resetEditPageFormData (state) {
    state.addPageFormData = {}
  },

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
     * @param {*} page
     */
  addPageToList (state, page) {
    state.list.push(page)
  },

  /**
     *
     * @param {*} state
     * @param {String} id
     */
  deletePageFromList (state, id) {
    state.list = state.list.filter(function (obj) {
      return obj.id !== id
    })
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setListError (state, error) {
    state.listError = error
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setAddPageFormSubmitError (state, error) {
    state.addPageFormSubmitError = error
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setDeletePageError (state, error) {
    state.deletePageError = error
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setEditPageFormDataError (state, error) {
    state.editPageFormDataError = error
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setEditPageFormSubmitError (state, error) {
    state.editPageFormSubmitError = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
