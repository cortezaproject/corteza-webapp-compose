// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Index from './views/Index.vue'

import './global'
import './plugins'
import './main.scss'

import router from './router'
import store from './store'

if (window.CrustConfig === undefined) {
  alert('Unexisting or invalid configuration. Make sure there is a public/config.js configuration file.')
} else {
  new Vue({
    router,
    store,
    render: h => h(Index),
  }).$mount('#app')
}
