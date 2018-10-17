'use strict'

const state = {
  initListError: '',
  list: [],

  // --- B --- Add
  addModuleFormData: {
    name: '',
  },
  addModuleFormSubmitError: '',
  // --- E --- Add

  // --- B --- Delete
  deleteError: '',
  deleteModuleError: '',
  deleteModuleId: '',
  // --- E --- Delete

  // --- B --- Edit
  initEditModuleError: '',
  editModuleFormData: {
    name: '',
    fields: [],
  },
  editModuleFormSubmitError: '',
  // --- E --- Edit
}

const getters = {}

/**
 * Get new unique id from fields.
 * @param {{id}[]} fields
 * @param {String|null|undefined} potentialId
 */
const getNewIDForField = (fields, potentialId) => {
  if (potentialId == null) {
    return getNewIDForField(fields, 1)
  }
  let founded = false
  fields.forEach((value) => {
    if (value.id === potentialId) {
      founded = true
    }
  })
  if (founded) {
    return getNewIDForField(fields, ++potentialId)
  }
  return potentialId
}

// TEMP

const actions = {
  /**
     * @param {commit: any, state: any} param0
     */
  async handleAddModuleFormSubmit ({ commit, state }) {
    try {
      commit('setAddModuleFormSubmitError', '')
      const module = await this._vm.$crm.moduleCreate(state.addModuleFormData.name, [])
      commit('resetAddModuleFormData')
      commit('addModuleToList', module)
    } catch (e) {
      commit('setAddModuleFormSubmitError', 'Error when trying to create module.')
      throw e
    }
  },

  /**
     *@param {commit: any} param0
     */
  async initList ({ commit }) {
    // TODO API CALL to get json schema
    try {
      commit('setListError', '')
      const json = await this._vm.$crm.moduleList()
      commit('setList', json)
    } catch (e) {
      commit('setListError', 'Error when trying to get list of modules.')
      throw e
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
      commit('setEditModuleFormDataError', 'Error when trying to init module form.')
      throw e
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
      commit('setDeleteModuleError', 'Error when trying to delete module.')
      throw e
    }
  },

  /**
     * @param {commit: any, state: any} param0
     */
  async handleEditModuleFormSubmit ({ commit, state }) {
    try {
      commit('setEditModuleFormSubmitError', '')
      await this._vm.$crm.moduleEdit(state.editModuleFormData.id, state.editModuleFormData.name, state.editModuleFormData.fields)
      commit('resetEditModuleFormData')
    } catch (e) {
      commit('setEditModuleFormSubmitError', 'Error when trying to edit module.')
      throw e
    }
  },

  /**
     * @param {commit: any, state: any} param0
     */
  async handleEditModuleAddNewField ({ commit, state }) {
    commit('editModuleAddEmptyField')
  },

  /**
     * @param {commit: any} param0
     */
  async handleEditModuleRemoveField ({ commit }, field) {
    commit('editModuleRemoveField', field)
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
    state.editModuleFormData = newValue
  },

  editModuleAddEmptyField (state) {
    state.editModuleFormData.fields.push({
      id: getNewIDForField(state.editModuleFormData.fields),
      name: '',
      title: '',
      kind: 'text',
      gdpr: false,
    })
  },

  editModuleRemoveField (state, field) {
    const index = state.editModuleFormData.fields.indexOf(field)
    if (index !== -1) {
      state.editModuleFormData.fields.splice(index, 1)
    }
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
