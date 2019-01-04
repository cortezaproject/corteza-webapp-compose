import { CRM } from 'crust-api-client'

export default {
  install (Vue) {
    const client = new CRM({ baseURL: window.CrustConfig.crm.baseUrl })
    Vue.prototype.$crm = client
  },
}
