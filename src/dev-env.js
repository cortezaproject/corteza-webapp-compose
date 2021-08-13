import Vue from 'vue'
import Router from 'vue-router'
import BootstrapVue from 'bootstrap-vue'
import i18n from './i18n'
import c3catalogue from './components/C3'
import { components } from '@cortezaproject/corteza-vue'
import './components'
import './themes'

const routes = [
  {
    path: '/c3',
    name: 'c3',
    component: components.C3.View,
    props: { catalogue: c3catalogue },
  },
  { path: '*', redirect: { name: 'c3' } },
]

Vue.use(Router)
Vue.use(BootstrapVue)

export default new Vue({
  el: '#app',
  name: 'DevEnv',
  template: '<router-view/>',
  router: new Router({
    mode: 'history',
    routes,
  }),
  i18n: i18n(),
})
