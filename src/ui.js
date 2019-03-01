import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSort, faSortUp, faSortDown, faWrench, faGripVertical, faDownload } from '@fortawesome/free-solid-svg-icons'
import { faEye } from '@fortawesome/free-regular-svg-icons'

Vue.component('font-awesome-icon', FontAwesomeIcon)

library.add(
  faEye,
  faSort,
  faSortUp,
  faSortDown,
  faWrench,
  faGripVertical,
  faDownload
)
