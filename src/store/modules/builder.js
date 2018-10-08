import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    blockType: null,
    formData: {
        title: '',
        url: '',
    },
};

const getters = {};

const actions = {
    handleBlockTypeChange({ commit }, event) {
        const selected = event.target.value;
        commit('setBlockType', selected);
    },
    handleFormSubmit({ commit, state }) {
        console.log(state.formData);
    },
};

const mutations = {
    setBlockType(state, newValue) {
        state.blockType = newValue;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
