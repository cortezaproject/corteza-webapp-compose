'use strict'

import BlocksService from '@/services/BlocksService';
import SharedService from '@/services/SharedService';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const state = {
  // Page data
  pageData: null,
  contentFieldsEnabled: false,
  contentListEnabled: false,

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

  // Current selected block type
  blockType: null,

  // Form's model when adding a block
  addBlockFormData: {},
  addBlockFormMeta: {},
  addBlockFormContent: {
    fields: [],
  },

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

  contentFieldsAvailable: [],
}

const getters = {
  /**
    * Return the max y of the layout
    *
    * @param {*} state
    */
  getMaxY (state) {
    console.log(state.layout)
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
      const page = await this._vm.$crm.pageRead({ id: pageID })
      console.log(page.blocks)

      // Setting pageData in state
      commit('setPageData', page)

      // Setting layout in state (if null, set empty array instead)
      let blocks = [];
      if (page.blocks && page.blocks.length > 0) {
        blocks = page.blocks
      }
      commit('setLayout', blocks)

      // Available fields if we have a module linked to the page
      commit('setContentFieldsEnabled', !!page.module)

      // Available list if we don't have a module linked to the page
      commit('setContentListEnabled', !page.module)

      // --- B ---- Available fields building
      const allFieldsAvailableForPage = page.module ? page.module.fields : []
      const allFieldsAvailableForPageIndexedById = {}
      allFieldsAvailableForPage.forEach((value) => {
        allFieldsAvailableForPageIndexedById[value.id] = value
      })
      console.log(allFieldsAvailableForPageIndexedById);
      blocks.forEach((value) => {
        if (value.content && value.content.fields) {
          value.content.fields.forEach((valueField) => {
            console.log('deleted')
            delete allFieldsAvailableForPageIndexedById[valueField.id]
          })
        }
      })
      commit('setContentFieldsAvailable', Object.values(allFieldsAvailableForPageIndexedById))
      // --- E ---- Available fields building
    } else {
      alert('No page ID provided')
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

    // Change addBlockFormContent
    commit('setAddBlockFormContent', item.content)
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

      // Content
      const content = SharedService.cloneObject(state.addBlockFormContent)

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
        content,
      }
      commit('incrementIndex')
      commit('resetAddBlockFormData')
      commit('addBlockToLayout', block)
    } else if (state.mode === 'edit') {
      // Hide form
      commit('resetAddBlockFormData')

      commit('resetAddBlockFormContent')

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
    const pageModuleID = state.pageData.module ? state.pageData.module.id : null
    const pageInfos = {
      title: state.pageData.title,
      description: state.pageData.description,
      visible: state.pageData.visible,
    }
    const pageBlocks = state.layoutTemp

    // Editing page
    await this._vm.$crm.pageEdit({ id: pageID, selfID: null, moduleID: pageModuleID, title: pageInfos.title, description: pageInfos.description, visible: pageInfos.visible, blocks: pageBlocks })

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
    const blocksForMobile = BlocksService.cloneBlocksForMobileView(state.layout)

    // Set colNum to 1
    commit('setColNum', 1)

    // Set layout
    commit('setLayout', blocksForMobile)
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

  setContentFieldsAvailable (state, newValue) {
    state.contentFieldsAvailable = newValue
  },

  setContentFieldsEnabled (state, newValue) {
    state.contentFieldsEnabled = newValue
  },

  setContentListEnabled (state, newValue) {
    state.contentListEnabled = newValue
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

  setAddBlockFormContent (state, newValue) {
    state.addBlockFormContent = newValue
  },

  setAddBlockFormContentFields (state, newValue) {
    state.addBlockFormContent.fields = newValue
  },

  setAddBlockFormContentList (state, newValue) {
    state.addBlockFormContent.list = newValue
  },

  resetAddBlockFormData (state) {
    state.blockType = null
    state.addBlockFormData = {}
  },

  resetAddBlockFormContent (state) {
    state.addBlockFormContent = {
      fields: [],
    }
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
