'use strict';

// import crm from '@/client/crm';
import Vue from 'vue';
import Vuex from 'vuex';
import SharedService from '../../services/SharedService';

Vue.use(Vuex);

const state = {
    // The layout of the builder
    layout: [{ i: '1', x: 0, y: 0, w: 2, h: 1 }, { i: '2', x: 1, y: 1, w: 1, h: 1 }],
    // Unkown - may be imporant
    index: 0,
    // Are (all) the grid items resizable
    resizable: true,
    // Are (all) the grid items draggable
    draggable: true,

    // Current selected block type
    blockType: null,
    // Current jsonSchema (changes with block type)
    jsonSchema: null,

    // Form's model when adding a block
    addBlockFormData: {},

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
    getMaxY(state) {
        const array = state.layout.map(o => o.y);
        let max;

        if (array.length === 0) {
            max = 0;
        } else {
            max = Math.max(...array);
            max++;
        }

        return max;
    },
};

// TEMP

const actions = {
    /**
     * Fetches the correct json schema
     * then sets (via mutation) the block type and the json schema
     *
     * @param {*} param0
     * @param {*} event
     */
    async handleBlockTypeChange({ commit }, event) {
        const selected = event.target.value;

        // Api call to get json schema
        try {
            const json = require(`../../api/mock/json-schema-type-${selected}.json`);

            commit('setJsonSchema', json);
            commit('setBlockType', selected);
        } catch (e) {
            console.log(e);
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
        // It maybe useless to get this
        const maxY = getters.getMaxY;

        const uniqID = SharedService.generateUniqID();

        console.log(state);

        const block = {
            i: uniqID,
            x: state.defaults.x,
            y: maxY,
            w: state.defaults.w,
            h: state.defaults.h,
            data: state.addBlockFormData,
            blockType: state.blockType,
        };

        commit('incrementIndex');
        commit('addBlockToLayout', block);
    },
};

const mutations = {
    setLayout(state, newValue) {
        state.layout = newValue;
    },

    setJsonSchema(state, newValue) {
        state.jsonSchema = newValue;
    },

    setBlockType(state, newValue) {
        state.blockType = newValue;
    },

    addBlockFormData(state, newValue) {
        state.addBlockFormData = newValue;
    },

    incrementIndex(state) {
        state.index++;
    },

    addBlockToLayout(state, block) {
        const layout = JSON.parse(JSON.stringify(state.layout));
        layout.push(block);

        state.layout = layout;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
