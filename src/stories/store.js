import Vuex from 'vuex'

import ComposeAPI from './compose'
import SystemAPI from './system'

import namespace from '../store/namespace'
import module from '../store/module'
import page from '../store/page'
import chart from '../store/chart'
import user from '../store/user'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    namespace: namespace(ComposeAPI),
    module: module(ComposeAPI),
    page: page(ComposeAPI),
    chart: chart(ComposeAPI),
    user: user(SystemAPI),
  },
})
