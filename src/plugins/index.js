import auth from '@/plugins/auth'
import crm from '@/plugins/crm'
import store from '@/store'
import Vue from 'vue'

console.log('[plugins] register auth')
Vue.use(auth, store)
console.log('[plugins] register crm')
Vue.use(crm, store)
