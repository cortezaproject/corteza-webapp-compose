import SAM from '@/client/api/sam'

import config from '@/api/config'
import store from '@/store'

const client = new SAM(config.endpoints.auth || 'https://sam.api.latest.rustbucket.io', store.getters['auth/jwt'])

export default client
