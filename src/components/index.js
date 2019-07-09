import Vue from 'vue'

Vue.component('permissions-button', () => import('corteza-webapp-common/components').then(c => c['PermissionsButton']))
Vue.component('font-awesome-icon', () => import('@fortawesome/vue-fontawesome'))
