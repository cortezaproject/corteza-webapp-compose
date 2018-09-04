import crm from '@/client/api/crm'
import config from '@/api/config'
import store from '@/store'

const client = new crm(config.endpoints.auth || window.location.protocol + '//' + window.location.hostname + ':3001', store.getters['auth/jwt'])

export default client
