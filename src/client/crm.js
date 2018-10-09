import CRM from '@/client/api/crm'

import config from '@/api/config'
import store from '@/store'

const client = new CRM(config.endpoints.auth || 'https://crm.api.latest.rustbucket.io', store.getters['auth/jwt'])

export default client
