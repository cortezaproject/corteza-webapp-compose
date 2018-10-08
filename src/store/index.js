import Vue from 'vue';
import Vuex from 'vuex';
import auth from './auth';
import builder from './modules/builder';

Vue.use(Vuex)

const store = new Vuex.Store({
    modules: {
        auth,
        builder,
    },
})

export default store
