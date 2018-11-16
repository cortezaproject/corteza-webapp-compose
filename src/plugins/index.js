import store from '@/store'
import Vue from 'vue'

import system from '@/plugins/system'
import sam from '@/plugins/sam'
import crm from '@/plugins/crm'
import logger from '@/plugins/logger'

Vue.use(logger)
Vue.use(system, store)
Vue.use(crm, store)
Vue.use(sam, store)
