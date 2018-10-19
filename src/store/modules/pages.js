'use strict'
import BlocksService from '@/services/BlocksService'
const state = {
  list: [],

  // --- B --- View
  viewPageColNum: 2,
  viewPageData: {
    title: '',
    blocks: [],
    mobileBlocks: [],
  },
  viewPageDataError: '',
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
  editPageError: '',
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
    const json = await this._vm.$crm.pageList()
    commit('setList', json)
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async initViewPageData ({ commit }, id) {
    const json = await this._vm.$crm.pageRead(id)
    if (json.id === '0') {
      throw new Error('No id')
    };
    json.mobileBlocks = BlocksService.cloneBlocksForMobileView(json.blocks)
    commit('setViewPageData', json)
  },
  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async initEditPageFormData ({ commit }, id) {
    const json = await this._vm.$crm.pageRead(id)
    commit('setEditPageFormData', json)
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async deletePage ({ commit }, id) {
    await this._vm.$crm.pageDelete(id)
    commit('deletePageFromList', id)
  },

  /**
     * @param {commit: any, state: any} param0
     */
  async handleEditPageFormSubmit ({ commit, state }) {
    await this._vm.$crm.pageEdit(state.editPageFormData.id, null, state.editPageFormData.moduleID, state.editPageFormData.title, null, true, null)
    commit('resetEditPageFormData')
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
  setViewPageColNum (state, newValue) {
    state.viewPageColNum = newValue
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
