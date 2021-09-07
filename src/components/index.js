import Vue from 'vue'
import { FontAwesomeIcon, FontAwesomeLayers } from '@fortawesome/vue-fontawesome'
import PortalVue from 'portal-vue'
import './faIcons'
import { components } from '@cortezaproject/corteza-vue'
import CTranslationButton from './Translator/CTranslatorButton'

Vue.use(PortalVue)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('c-permissions-button', components.CPermissionsButton)
Vue.component('c-translation-button', CTranslationButton)
Vue.component('c-input-confirm', components.CInputConfirm)
