'use strict';

// import crm from '@/client/crm';
import axios from 'axios';
import Vue from 'vue';
import Vuex from 'vuex';
import SharedService from '../../services/SharedService';

Vue.use(Vuex);

const state = {
    //
    layout: [{ i: '1', x: 0, y: 0, w: 2, h: 1 }, { i: '2', x: 1, y: 1, w: 1, h: 1 }],
    index: 0,
    resizable: true,
    draggable: true,

    //
    blockType: null,
    jsonSchema: null,

    //
    addblockFormData: {
        title: '',
        url: '',
    },

    // block data defaults
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

const actions = {
    /**
     *
     * @param {*} param0
     * @param {*} event
     */
    async handleBlockTypeChange({ commit }, event) {
        const selected = event.target.value;

        // Api call to get json schema
        try {

            const response = await axios.get(`mock/json-schema-type-${selected}.json`);

            commit('setJsonSchema', response.data);
            commit('setBlockType', selected);


        } catch (e) {
            console.log(e);
        }
        

    },

    /**
     *
     * @param {*} param0
     * @param {*} blockData
     */
    handleBlockSelectorFormSubmit({ commit, getters, state }) {
        const maxY = getters.getMaxY;
        const uniqID = SharedService.generateUniqID();

        const block = {
            i: uniqID,
            x: state.defaults.x,
            y: maxY,
            w: state.defaults.w,
            h: state.defaults.h,
            data: state.addblockFormData,
        };

        commit('incrementIndex');
        commit('addBlockToLayout', block);
    },
};

const mutations = {
    /**
     *
     * @param {*} state
     * @param {*} layout
     */
    setLayout(state, newValue) {
        state.layout = newValue;
    },

    incrementIndex(state) {
        state.index++;
    },

    setJsonSchema(state, newValue) {
        state.jsonSchema = newValue;
    },

    /**
     *
     * @param {*} state
     * @param {*} newValue
     */
    setBlockType(state, newValue) {
        state.blockType = newValue;
    },

    /**
     *
     * @param {*} state
     * @param {*} block
     */
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
