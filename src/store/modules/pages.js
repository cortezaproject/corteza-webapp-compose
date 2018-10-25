'use strict'
import BlocksService from '@/services/BlocksService'
const state = {
  list: [],

  // --- B --- View
  viewPageColNum: 2,
  viewPageData: {
    id: '',
    title: '',
    blocks: [],
    mobileBlocks: [],
  },
  // --- E --- View
}

const getters = {}

// TEMP

const actions = {
  /**
     *@param {commit: any} param0
     */
  async initList ({ commit }) {
    const json = await this._vm.$crm.pageList({})
    commit('setList', json)
  },

  /**
     *@param {commit: any} param0
     *@param {String} id
     */
  async initViewPageData ({ commit }, id) {
    const json = await this._vm.$crm.pageRead({ id })
    if (json.id === '0') {
      throw new Error('No id')
    };
    json.blocks = await BlocksService.cloneBlocksAndPopulate(json, json.blocks, this._vm.$crm)
    json.mobileBlocks = BlocksService.cloneBlocksForMobileView(json.blocks)
    commit('setViewPageData', json)
  },
}

const mutations = {
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
     * @param {Array} list
     */
  setList (state, list) {
    state.list = list
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
