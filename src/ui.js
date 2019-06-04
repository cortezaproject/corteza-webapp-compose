import Vue from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSort, faSortUp, faSortDown, faWrench, faGripVertical, faDownload, faFileExport } from '@fortawesome/free-solid-svg-icons'
import { faEye, faFileAlt, faFileWord, faFilePdf, faFilePowerpoint, faFileArchive, faFileExcel, faFileVideo, faFileImage } from '@fortawesome/free-regular-svg-icons'

Vue.component('font-awesome-icon', FontAwesomeIcon)

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
  faFileExport
)
