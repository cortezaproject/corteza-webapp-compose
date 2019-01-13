import Vue from 'vue'

import system from '@/plugins/system'
import crm from '@/plugins/crm'
import messaging from '@/plugins/messaging'
import logger from '@/plugins/logger'

Vue.use(logger)
Vue.use(system)
Vue.use(crm)
Vue.use(messaging)
