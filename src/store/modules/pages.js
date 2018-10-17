'use strict'

const state = {
  initListError: '',
  list: [],

  // --- B --- View
  viewPageData: {
    title: '',
    blocks: [],
  },
  viewPageDataError: '',
  viewPageLayout: {
    index: 0,
    colNum: 2,
  },
  // --- E --- View

  // --- B --- Add
  addPageFormData: {
    title: '',
  },
  addPageFormSubmitError: '',
  // --- E --- Add

  // --- B --- Delete
  deleteError: '',
  deletePageError: '',
  deletePageId: '',

  // --- E --- Delete

  // --- B --- Edit
  initEditPageError: '',
  editPageFormData: {
    title: '',
    moduleID: '',
  },
  editPageFormSubmitError: '',
  // --- E --- Edit
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
      const page = await this._vm.$crm.pageCreate(null, null, state.addPageFormData.title, null, true, null)
      commit('resetAddPageFormData')
      commit('addPageToList', page)
    } catch (e) {
      commit('setAddPageFormSubmitError', 'Error when trying to create page.')
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
      const json = await this._vm.$crm.pageList()
      commit('setList', json)
    } catch (e) {
      commit('setListError', 'Error when trying to get list of pages.')
      throw e
    }
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async initViewPageData ({ commit }, id) {
    // TODO API CALL to get json schema
    try {
      commit('setViewPageDataError', '')
      const json = await this._vm.$crm.pageRead(id)
      commit('setViewPageData', json)
    } catch (e) {
      commit('setViewPageDataError', 'Error when trying to get page data.')
      throw e
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
      commit('setEditPageFormDataError', 'Error when trying to init page form.')
      throw e
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
      commit('setDeletePageError', 'Error when trying to delete page.')
      throw e
    }
  },

  /**
     * @param {commit: any, state: any} param0
     */
  async handleEditPageFormSubmit ({ commit, state }) {
    try {
      commit('setEditPageFormSubmitError', '')
      await this._vm.$crm.pageEdit(state.editPageFormData.id, null, state.editPageFormData.moduleID, state.editPageFormData.title, null, true, null)
      commit('resetEditPageFormData')
    } catch (e) {
      commit('setEditPageFormSubmitError', 'Error when trying to edit page.')
      throw e
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
  setViewPageData (state, newValue) {
    state.viewPageData = newValue
  },

  /**
     *
     * @param {*} state
     * @param {*} newValue
     */
  setEditPageFormData (state, newValue) {
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
  setViewPageDataError (state, error) {
    state.viewPageDataError = error
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
