import Vue from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import PortalVue from 'portal-vue'
import './faIcons'
import { components } from '@cortezaproject/corteza-vue'

Vue.use(PortalVue)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('permissions-button', components.PermissionsButton)
