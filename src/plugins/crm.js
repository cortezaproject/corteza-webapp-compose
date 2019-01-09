import CRM from '@/api/crm'

export default {
  install (Vue) {
    Vue.prototype.$crm = CRM
  },
}
