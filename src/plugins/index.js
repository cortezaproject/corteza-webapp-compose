import auth from '@/plugins/auth'
import crm from '@/plugins/crm'
import store from '@/store'
import Vue from 'vue'

Vue.use(auth, store)
Vue.use(crm, store)
