import Vue from 'vue'
import store from '@/store'
import crm from '@/plugins/crm'
import auth from '@/plugins/auth'

console.log('[plugins] register auth')
Vue.use(auth, store)
console.log('[plugins] register crm')
Vue.use(crm, store)
