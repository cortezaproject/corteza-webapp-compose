import { System } from 'crust-api-client'

export default {
  install (Vue) {
    const client = new System({ baseURL: window.CrustConfig.system.baseUrl })
    Vue.prototype.$system = client
  },
}
