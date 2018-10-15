'use strict'

// import crm from '@/client/crm';
import SharedService from '@/services/SharedService'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  // The layout of the builder
  layout: [],
  // Unkown - may be imporant
  index: 0,
  // Are (all) the grid items resizable
  resizable: true,
  // Are (all) the grid items draggable
  draggable: true,
  //
  colNum: 2,
  //
  rowHeight: 90,

  // Current selected block type
  blockType: null,
  // Current jsonSchema (changes with block type)
  jsonSchema: null,

  // Form's model when adding a block
  addBlockFormData: {},
  addBlockFormMeta: {},

  // Block data defaults
  defaults: {
    x: 0,
    w: 1,
    h: 1,
  },
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

// TEMP

const actions = {

  /**
   * Fetches the layout
   *
   * @param {*} param0
   */
  fetchLayout ({ commit }) {
    const layout = JSON.parse(localStorage.getItem('layout'))
    if (layout) {
      commit('setLayout', layout)
    }
  },

  /**
    * Fetches the correct json schema
    * then sets (via mutation) the block type and the json schema
    *
    * @param {*} param0
    * @param {*} event
    */
  async handleBlockTypeChange ({ commit }, event) {
    const selected = event.target.value

    // Api call to get json schema
    try {
      const json = require(`../../api/mock/json-schema-type-${selected}.json`)

      commit('setJsonSchema', json)
      commit('setBlockType', selected)
    } catch (e) {
      console.log(e)
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
  },

  handleDoneButtonClick ({ state }) {
    const layout = SharedService.cloneObject(state.layout)

    localStorage.setItem('layout', JSON.stringify(layout))

    alert('layout saved !')
  },
}

const mutations = {
  setLayout (state, newValue) {
    state.layout = newValue
  },

  setJsonSchema (state, newValue) {
    state.jsonSchema = newValue
  },

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

  incrementIndex (state) {
    state.index++
  },

  addBlockToLayout (state, block) {
    const layout = SharedService.cloneObject(state.layout)
    layout.push(block)

    state.layout = layout
  },

  removeBlockFromLayout (state, block) {
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
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
