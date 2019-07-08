// App's components
// import { PermissionsButton } from 'corteza-webapp-common/components'

// Font awesome libs, icons, components
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default (Vue) => {
  Vue.component('permissions-button', () => import('corteza-webapp-common/components').then(c => c['PermissionsButton']))
  Vue.component('font-awesome-icon', () => import('@fortawesome/vue-fontawesome'))
}
