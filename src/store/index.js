import Vuex from 'vuex'

import ComposeAPI from 'corteza-webapp-common/src/lib/corteza-server/compose'

import namespace from './namespace'
import module from './module'
import page from './page'
import trigger from './trigger'
import chart from './chart'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    namespace: namespace(ComposeAPI),
    module: module(ComposeAPI),
    page: page(ComposeAPI),
    trigger: trigger(ComposeAPI),
    chart: chart(ComposeAPI),
  },
})
