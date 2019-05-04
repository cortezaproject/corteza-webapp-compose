import ComposeAPI from '@/api/compose'

export default {
  install (Vue) {
    Vue.prototype.$compose = ComposeAPI
  },
}
