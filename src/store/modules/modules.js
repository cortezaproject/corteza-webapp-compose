'use strict'

import Vue from 'vue'

const state = {
  initListError: '',
  list: [],
  addModuleFormData: {
    name: '',
  },
  addModuleFormSubmitError: '',
  deleteError: '',
  deleteModuleError: '',
  deleteModuleId: '',
  initEditModuleError: '',
  editModuleFormData: {
    name: '',
  },
  editModuleFormSubmitError: '',
}

const getters = {}

// TEMP

const actions = {
  /**
     * @param {commit: any, state: any} param0
     */
  async handleAddModuleFormSubmit ({ commit, state }) {
    try {
      commit('setAddModuleFormSubmitError', '')
      const module = await this._vm.$crm.moduleCreate(state.addModuleFormData.name)
      commit('resetAddModuleFormData')
      commit('addModuleToList', module)
    } catch (e) {
      console.error(e)
      commit('setAddModuleFormSubmitError', 'Error when trying to create module.')
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
      const json = await this._vm.$crm.moduleList()
      commit('setList', json)
    } catch (e) {
      console.error(e)
      commit('setListError', 'Error when trying to get list of modules.')
    }
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async initEditModuleFormData ({ commit }, id) {
    // TODO API CALL to get json schema
    try {
      commit('setEditModuleFormDataError', '')
      const json = await this._vm.$crm.moduleRead(id)
      commit('setEditModuleFormData', json)
    } catch (e) {
      console.error(e)
      commit('setEditModuleFormDataError', 'Error when trying to init module form.')
    }
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async deleteModule ({ commit }, id) {
    try {
      commit('setDeleteModuleError', '')
      await this._vm.$crm.moduleDelete(id)
      commit('deleteModuleFromList', id)
    } catch (e) {
      console.error(e)
      commit('setDeleteModuleError', 'Error when trying to delete module.')
    }
  },

  /**
     * @param {commit: any, state: any} param0
     */
  async handleEditModuleFormSubmit ({ commit, state }) {
    try {
      commit('setEditModuleFormSubmitError', '')
      await this._vm.$crm.moduleEdit(state.editModuleFormData.id, state.editModuleFormData.name)
      commit('resetEditModuleFormData')
    } catch (e) {
      console.error(e)
      commit('setEditModuleFormSubmitError', 'Error when trying to edit module.')
    }
  },
}

const mutations = {
  /**
     *
     * @param {*} state
     * @param {*} newValue
     */
  setAddModuleFormData (state, newValue) {
    state.addModuleFormData = newValue
  },

  /**
     *
     * @param {*} state
     * @param {*} newValue
     */
  setEditModuleFormData (state, newValue) {
    console.log(JSON.stringify(state.editModuleFormData))
    console.log(newValue)
    state.editModuleFormData = newValue
  },

  /**
     *
     * @param {*} state
     */
  resetAddModuleFormData (state) {
    state.addModuleFormData = {}
  },

  /**
     *
     * @param {*} state
     */
  resetEditModuleFormData (state) {
    state.addModuleFormData = {}
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
     * @param {*} module
     */
  addModuleToList (state, module) {
    state.list.push(module)
  },

  /**
     *
     * @param {*} state
     * @param {String} id
     */
  deleteModuleFromList (state, id) {
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
  setAddModuleFormSubmitError (state, error) {
    state.addModuleFormSubmitError = error
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setDeleteModuleError (state, error) {
    state.deleteModuleError = error
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setEditModuleFormDataError (state, error) {
    state.editModuleFormDataError = error
  },

  /**
     *
     * @param {*} state
     * @param {String} error
     */
  setEditModuleFormSubmitError (state, error) {
    state.editModuleFormSubmitError = error
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
