'use strict'

import SharedService from '@/services/SharedService'
import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  // Page data
  pageData: null,

  // The layout of the builder
  layout: [],
  layoutTemp: [],
  layoutMobile: [],

  // Unkown - may be imporant
  index: 0,

  // Are (all) the grid items resizable
  resizable: true,

  // Are (all) the grid items draggable
  draggable: true,

  // Number of columns in the grid
  colNum: 2,

  // Height (in px) of a row in the grid
  rowHeight: 90,

  // Current selected block type
  blockType: null,

  // Form's model when adding a block
  addBlockFormData: {},
  addBlockFormMeta: {},

  // Block data defaults
  defaults: {
    x: 0,
    w: 1,
    h: 1,
    colNum: 2,
  },

  // Is the mobile preview active
  mobilePreview: false,

  // Mode
  mode: 'add',
}

const getters = {
  /**
    * Return the max y of the layout
    *
    * @param {*} state
    */
  getMaxY (state) {
    const array = state.layout.map(o => o.y)
    let max

    if (array.length === 0) {
      max = 0
    } else {
      max = Math.max(...array)
      max++
    }

    return max
  },
}

const actions = {

  async fetchPageData ({ commit }, pageID) {
    if (pageID) {
      // Getting current page
      const page = await this._vm.$crm.pageRead(pageID)

      // Setting pageData in state
      commit('setPageData', page)

      // Setting layout in state (if null, set empty array instead)
      commit('setLayout', page.blocks || [])
    } else {
      console.error('No page ID provided')
    }
  },

  /**
    * Sets (via mutation) the block type
    *
    * @param {*} param0
    * @param {*} event
    */
  async handleBlockTypeChange ({ commit }, event) {
    const selected = event.target.value
    commit('setBlockType', selected)
  },

  async handleEditBlockButtonClick ({ state, commit }, item) {
    // Change mode
    commit('setMode', 'edit')

    // Change current block type
    const blockType = item.blockType
    commit('setBlockType', blockType)

    // Change addBlockFormData
    commit('setAddBlockFormData', item.data)
  },

  /**
    * Gets the last y of the layout
    * Gets a uniq ID for the block
    * Create a block taking the current addBlockFormData
    * Increments the index (mutation)
    * Adds the block to the layout (mutation)
    *
    * @param {*} param0
    * @param {*} blockData
    */
  handleBlockSelectorFormSubmit ({ commit, getters, state }) {
    if (state.mode === 'add') {
      // Index
      const i = SharedService.generateUniqID()

      // X value
      const x = state.defaults.x

      // It maybe useless to get this
      let y = getters.getMaxY

      // Width
      let w = state.defaults.w

      // Height
      const h = state.defaults.h

      // Data
      const data = SharedService.cloneObject(state.addBlockFormData)

      // Meta
      const meta = SharedService.cloneObject(state.addBlockFormMeta)

      // Block Type
      const blockType = SharedService.cloneObject(state.blockType)

      if (state.addBlockFormMeta.fixed) {
        commit('moveAllBlocksY')

        y = 0
        w = state.colNum
      }

      const block = {
        i,
        x,
        y,
        w,
        h,
        data,
        meta,
        blockType,
      }

      commit('incrementIndex')
      commit('resetAddBlockFormData')
      commit('addBlockToLayout', block)
    } else if (state.mode === 'edit') {
      // Hide form
      commit('resetAddBlockFormData')

      // Go back to add mode
      commit('setMode', 'add')
    }
  },

  /**
   *
   *
   * @param {*} param0
   */
  handleMobilePreviewButtonClick ({ commit, dispatch, state }) {
    const layout = SharedService.cloneObject(state.layout)

    // Saving layout in temp
    commit('setLayoutTemp', layout)

    // Building mobile layout
    dispatch('showMobileLayout')
    commit('setMobilePreview', true)

    const layoutMobile = SharedService.cloneObject(state.layout)

    // Saving layout mobile in temp
    commit('setLayoutMobile', layoutMobile)
  },

  async handleDoneButtonClick ({ commit, state }) {
    // Getting all infos
    const pageID = state.pageData.id
    const pageModuleID = state.pageData.module.id
    const pageInfos = {
      title: state.pageData.title,
      description: state.pageData.description,
      visible: state.pageData.visible,
    }
    const pageBlocks = state.layoutTemp

    // Editing page
    await this._vm.$crm.pageEdit(pageID, /* selfID */ null, pageModuleID, pageInfos.title, pageInfos.description, pageInfos.visible, pageBlocks)

    // Returning to desktop view
    commit('setMobilePreview', false)

    // Setting colNum to default
    commit('setColNum', state.defaults.colNum)

    // Showing desktop layout
    commit('setLayout', state.layoutTemp)

    alert('Layouts saved !')
  },

  /**
   * Rearrange layout to fit mobile. (1 column)
   *
   * @param {*} state
   */
  showMobileLayout ({ commit, state }) {
    // Clone layout object
    const layout = SharedService.cloneObject(state.layout)

    // Group blocks by y
    const groupedByY = _.groupBy(layout, 'y')

    // Order all groups by x (asc)
    const orderedByYAndX = _.map(groupedByY, (group) => {
      return _.orderBy(group, ['x'], ['asc'])
    })

    // Flatten array
    const flattened = _.flatten(orderedByYAndX)

    // Set colNum to 1
    commit('setColNum', 1)

    // Increment all y
    // All x at 0
    // All w at 1
    flattened.forEach((block, index, array) => {
      array[index].y = index
      array[index].x = 0
      array[index].w = 1
    })

    // Set layout
    commit('setLayout', SharedService.cloneObject(flattened))
  },

}

const mutations = {
  //
  // ─── LAYOUT ─────────────────────────────────────────────────────────────────────
  //

  setPageData (state, newValue) {
    state.pageData = newValue
  },

  setMobilePreview (state, newValue) {
    state.mobilePreview = newValue
  },

  setLayout (state, newValue) {
    state.layout = newValue
  },

  setLayoutTemp (state, newValue) {
    state.layoutTemp = newValue
  },

  setLayoutMobile (state, newValue) {
    state.layoutMobile = newValue
  },

  incrementIndex (state) {
    state.index++
  },

  setColNum (state, newValue) {
    state.colNum = newValue
  },

  addBlockToLayout (state, block) {
    const layout = SharedService.cloneObject(state.layout)
    layout.push(block)

    state.layout = layout
  },

  handleRemoveBlockButtonClick (state, block) {
    const blockID = block.i
    const blockIndex = state.layout.findIndex(o => o.i === blockID)

    const answer = confirm(`Are you sure you want to remove block ${blockID} ?`)
    if (answer) {
      state.layout.splice(blockIndex, 1)
      console.log('removing', blockID, 'at index', blockIndex)
    }
  },

  moveAllBlocksY (state) {
    state.layout.map(o => {
      o.y++
    })
  },

  // ────────────────────────────────────────────────────────────────────────────────
  //
  // ─── BLOCK TYPE FORM ────────────────────────────────────────────────────────────
  //

  setBlockType (state, newValue) {
    state.blockType = newValue
  },

  setAddBlockFormData (state, newValue) {
    state.addBlockFormData = newValue
  },

  setAddBlockFormMeta (state, newValue) {
    state.addBlockFormMeta = newValue
  },

  resetAddBlockFormData (state) {
    state.blockType = null
    state.addBlockFormData = {}
  },

  setMode (state, newValue) {
    state.mode = newValue
  },
  // ────────────────────────────────────────────────────────────────────────────────
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
