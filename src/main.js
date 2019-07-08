// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import './global'
import './plugins'
import router from './router'
import i18n from './i18next'
import store from './store'

import './themes'

/* eslint-disable no-undef */
console.log(
  `%cCompose, version: ${VERSION}, build time: ${BUILD_TIME}`,
  'background-color: #1397CB; color: white; padding: 3px 10px; border: 1px solid black; font: Courier',
)

if (window.SystemAPI === undefined) {
  alert('Missing or invalid configuration. Make sure there is a public/config.js configuration file.')
} else {
  new Vue({
    name: 'compose',
    router,
    i18n,
    store,
    template: '<div id="compose" class="h-100"><router-view class="view" /></div>',
  }).$mount('#app')
}
