'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import SharedService from '../../services/SharedService';

Vue.use(Vuex);

const state = {
    //
    layout: [
        { i: '1', x: 0, y: 0, w: 2, h: 1 },
        { i: '2', x: 1, y: 1, w: 1, h: 1 },
    ],
    index: 0,

    //
    blockType: null,

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
    handleBlockTypeChange({ commit }, event) {
        const selected = event.target.value;
        commit('setBlockType', selected);
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
    setLayout(state, layout) {
        state.layout = layout;
    },

    setBlockInLayout(state, block) {
        console.log(block);
    },

    incrementIndex(state) {
        state.index++;
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
