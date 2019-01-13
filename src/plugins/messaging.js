import Messaging from '@/api/messaging'

export default {
  install (Vue) {
    Vue.prototype.$messaging = Messaging
  },
}
