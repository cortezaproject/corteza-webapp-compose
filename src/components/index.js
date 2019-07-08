// App's components
import { PermissionsButton } from 'corteza-webapp-common/components'

// Font awesome libs, icons, components
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

export default (Vue) => {
  Vue.component('permissions-button', PermissionsButton)
  Vue.component('font-awesome-icon', FontAwesomeIcon)
}
