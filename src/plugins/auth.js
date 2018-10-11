import axios from 'axios'

// Handles basic auth comm + state management
export default {
  install (Vue, store) {
    Vue.prototype.$auth = {
      baseURL () {
        return window.CrustConfig.auth.baseUrl || 'https://auth.api.latest.rustbucket.io'
      },

      api () {
        return axios.create({
          baseURL: this.baseURL(),
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        })
      },

      async clear () {
        return new Promise((resolve, reject) => {
          store.dispatch('auth/clear')

          this.api()
            .delete(`/check`)
            .then(({ data }) => {
              resolve()
            })
            .catch(error => {
              reject(error || new Error('Protocol error'))
            })
        })
      },

      async check () {
        return new Promise((resolve, reject) => {
          this.api()
            .get(`/check`)
            .then(({ data }) => {
              if (!data.response) {
                // Not authenticated
                // make sure this is reflected in the state
                store.dispatch('auth/clear')
                reject(new Error('Not authenticated'))
              } else {
                // Authentication successful, update state
                // and notify the caller
                console.debug('AuthCheck:', data.response.user)
                store.dispatch('auth/setUser', data.response.user)
                resolve(data.response.user)
              }
            })
            .catch(error => {
              reject(error || new Error('Protocol error'))
            })
        })
      },
    }
  },
}
