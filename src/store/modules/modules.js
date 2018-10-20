'use strict'

const state = {
  list: [],

  // --- B --- Add
  addModuleFormData: {
    name: '',
  },
  // --- E --- Add

  // --- B --- Delete
  deleteModuleId: '',
  // --- E --- Delete

  // --- B --- Edit
  editModuleFormData: {
    name: '',
    fields: [],
  },
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
    const module = await this._vm.$crm.moduleCreate({
      name: state.addModuleFormData.name,
      fields: [],
    })
    commit('resetAddModuleFormData')
    commit('addModuleToList', module)
  },

  /**
     *@param {commit: any} param0
     */
  async initList ({ commit }) {
    const json = await this._vm.$crm.moduleList({})
    commit('setList', json)
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async initEditModuleFormData ({ commit }, id) {
    const json = await this._vm.$crm.moduleRead({ id })
    commit('setEditModuleFormData', json)
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async deleteModule ({ commit }, id) {
    await this._vm.$crm.moduleDelete({ id })
    commit('deleteModuleFromList', id)
  },

  /**
     * @param {commit: any, state: any} param0
     */
  async handleEditModuleFormSubmit ({ commit, state }) {
    await this._vm.$crm.moduleEdit({
      id: state.editModuleFormData.id,
      name: state.editModuleFormData.name,
      fields: state.editModuleFormData.fields,
    })
    commit('resetEditModuleFormData')
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

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
