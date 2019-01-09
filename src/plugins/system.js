import System from '@/api/system'

export default {
  install (Vue) {
    Vue.prototype.$system = System
  },
}
