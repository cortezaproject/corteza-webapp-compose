import Vuex from 'vuex'

import ComposeAPI from 'corteza-webapp-common/src/lib/corteza-server/compose'
import SystemAPI from 'corteza-webapp-common/src/lib/corteza-server/system'

import namespace from './namespace'
import module from './module'
import page from './page'
import chart from './chart'
import user from './user'
import automationScript from './automation-script'

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',

  modules: {
    namespace: namespace(ComposeAPI),
    module: module(ComposeAPI),
    page: page(ComposeAPI),
    chart: chart(ComposeAPI),
    user: user(SystemAPI),
    automationScript: automationScript(ComposeAPI),
  },
})
