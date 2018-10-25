'use strict'

import BlocksService from '@/services/BlocksService'
import SharedService from '@/services/SharedService'
import Vue from 'vue'
import Vuex from 'vuex'

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
    listBuilder: {
      module: null,
      fields: [],
    },
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
  contentListFieldsAvailable: [],
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
      const page = await this._vm.$crm.pageRead({ id: pageID })

      // Setting pageData in state
      commit('setPageData', page)

      // --- B --- Setting layout in state
      let blocks = await BlocksService.cloneBlocksAndPopulate(page, page.blocks, this._vm.$crm)

      // --- B --- in order to display a "listBuilder" PageContent (just simple table with thead) and not the really table with data
      blocks.forEach((block) => {
        block.content.listBuilder = block.content.list
        delete block.content.list
      })
      // --- E --- in order to display a "listBuilder" PageContent (just simple table with thead) and not the really table with data
      commit('setLayout', blocks)
      // --- E --- Setting layout in state

      // Available fields if we have a module linked to the page
      commit('setContentFieldsEnabled', !!page.module)

      // Available list if we don't have a module linked to the page
      commit('setContentListEnabled', !page.module)

      // --- B ---- Available fields building

      commit('setContentFieldsAvailable', BlocksService.getContentFieldsAvailable(page, blocks))
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

  async handleSelectContentListModule ({ commit }, { moduleId, modulesList }) {
    const selectedModule = modulesList.filter((module) => module.id === moduleId)[0]
    commit('setAddBlockFormContentBuilderListModule', selectedModule)
    commit('setAddBlockFormContentBuilderListFields', [])
    commit('setContentListFieldsAvailable', selectedModule.fields)
  },

  async handleEditBlockButtonClick ({ dispatch, commit, state }, item) {
    // Change mode
    commit('setMode', 'edit')

    // Change current block type
    const blockType = item.blockType
    commit('setBlockType', blockType)

    // Change addBlockFormData
    commit('setAddBlockFormData', item.data)

    // Change addBlockFormContent
    commit('setAddBlockFormContent', item.content)

    // Set avaialble fields for list builder
    if (item.content.listBuilder && item.content.listBuilder.module) {
      // Dont set already selected fields
      commit('setContentListFieldsAvailable', item.content.listBuilder.module.fields.filter(
        (field) => {
          const fieldFounded = item.content.listBuilder.fields.filter(fieldHere => fieldHere.id === field.id)
          return fieldFounded.length === 0
        }))
    }
  },

  handleRemoveBlockButtonClick ({ state, commit }, block) {
    const blockID = block.i
    const blockIndex = state.layout.findIndex(o => o.i === blockID)

    const answer = confirm(`Are you sure you want to remove block ${blockID} ?`)
    if (answer) {
      state.layout.splice(blockIndex, 1)
      commit('setContentFieldsAvailable', BlocksService.getContentFieldsAvailable(state.pageData, state.layout))
    }
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
      commit('resetAddBlockFormContent')
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
    const pageInfos = {
      id: state.pageData.id,
      title: state.pageData.title,
      description: state.pageData.description,
      visible: state.pageData.visible,
      moduleID: state.pageData.module ? state.pageData.module.id : null,
    }

    // --- B ---- api format for blocks : set only the id and not the objects entirely
    const pageBlocks = SharedService.cloneObject(state.layoutTemp)
    pageBlocks.forEach((block) => {
      if (block.content.listBuilder) {
        block.content.list = {}
        if (block.content.listBuilder.fields) {
          block.content.list.fieldsID = block.content.listBuilder.fields.map(field => field.id)
        }
        if (block.content.listBuilder.module) {
          block.content.list.moduleID = block.content.listBuilder.module.id
        }
        delete block.content.listBuilder
      }
      if (block.content.fields) {
        block.content.fieldsID = block.content.fields.map(field => field.id)
        delete block.content.fields
      }
    })
    // --- E ---- api format for blocks : set only the id and not all the objects entirely

    const pageEditData = {
      ...pageInfos,
      blocks: pageBlocks,
    }

    // Editing page
    await this._vm.$crm.pageEdit(pageEditData)

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

  setContentListFieldsAvailable (state, newValue) {
    state.contentListFieldsAvailable = newValue
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

  setAddBlockFormContentBuilderListModule (state, newValue) {
    state.addBlockFormContent.listBuilder.module = newValue
  },

  setAddBlockFormContentBuilderListFields (state, newValue) {
    state.addBlockFormContent.listBuilder.fields = newValue
  },

  resetAddBlockFormData (state) {
    state.blockType = null
    state.addBlockFormData = {}
  },

  resetAddBlockFormContent (state) {
    state.addBlockFormContent = {
      fields: [],
      listBuilder: {
        module: null,
        fields: [],
      },
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
