import Vue from 'vue'

import system from 'corteza-webapp-common/src/plugins/system'
import compose from 'corteza-webapp-common/src/plugins/compose'
import messaging from 'corteza-webapp-common/src/plugins/messaging'
import logger from '@/plugins/logger'
import auth from 'corteza-webapp-common/src/plugins/auth'

Vue.use(logger)
Vue.use(system)
Vue.use(compose)
Vue.use(messaging)
Vue.use(auth)
