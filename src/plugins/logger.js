import logger from '@/logger'

export default {
  install (Vue, store) {
    Vue.prototype.$logger = logger
  },
}
