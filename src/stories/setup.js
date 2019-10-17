import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Vuex from 'vuex'

import '../themes'

import ComposeAPI from './compose'
import SystemAPI from './system'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import '../themes/corteza-base/index.scss'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSort, faSortUp, faSortDown, faWrench, faGripVertical, faDownload, faFileExport, faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faEye, faFileAlt, faFileWord, faFilePdf, faFilePowerpoint, faFileArchive, faFileExcel, faFileVideo, faFileImage, faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('permissions-button', () => import('corteza-webapp-common/src/components/Permissions/Button'))

library.add(
  faEye,
  faSort,
  faSortUp,
  faSortDown,
  faWrench,
  faGripVertical,
  faDownload,
  faFileAlt,
  faFileWord,
  faFilePdf,
  faFilePowerpoint,
  faFileArchive,
  faFileExcel,
  faFileVideo,
  faFileImage,
  faFileExport,
  faEdit,
  faTrashAlt,
  faSearch,
  faBars,
  faTimes,
)

Vue.use(BootstrapVue)
Vue.use(Vuex)

Vue.prototype.$ComposeAPI = ComposeAPI
Vue.prototype.$SystemAPI = SystemAPI

Vue.prototype.$auth = {
  JWT: '',
}
