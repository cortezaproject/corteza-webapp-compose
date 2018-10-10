'use strict'

// import crm from '@/client/crm';
import SharedService from '@/services/SharedService';
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

const state = {
    // The layout of the builder
    layout: [{ i: '2', x: 1, y: 1, w: 1, h: 1, meta: { fixed: false } }],
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
};

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
    handleBlockSelectorFormSubmit({ commit, getters, state }) {
        // Index
        const i = SharedService.generateUniqID();

        // X value
        const x = state.defaults.x;

        // It maybe useless to get this
        let y = getters.getMaxY;

        // Width
        let w = state.defaults.w;

        // Height
        const h = state.defaults.h;

    if (state.addBlockFormMeta.fixed) {
      commit('moveAllBlocksY')

            y = 0;
            w = state.colNum;
        }

        const block = {
            i,
            x,
            y,
            w,
            h,
            data: state.addBlockFormData,
            meta: state.addBlockFormMeta,
            blockType: state.blockType,
        };

    commit('incrementIndex')
    commit('addBlockToLayout', block)
    commit('resetAddFormData')
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
    const layout = JSON.parse(JSON.stringify(state.layout))
    layout.push(block)

        state.layout = layout;
    },

    moveAllBlocksY(state) {
        state.layout.map(o => {
            o.y ++;
        });
    },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
