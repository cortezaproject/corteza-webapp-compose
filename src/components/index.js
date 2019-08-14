import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import './faIcons'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('permissions-button', () => import('corteza-webapp-common/src/components/Permissions/Button'))
