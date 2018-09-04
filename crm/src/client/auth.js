import auth from '@/client/api/auth'
import config from '@/api/config'
import store from '@/store'

const client = new auth(config.endpoints.auth || window.location.protocol + '//' + window.location.hostname + ':3002', store.getters['auth/jwt'])

export default client
