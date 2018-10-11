import axios from 'axios'

var JSONbig = require('json-bigint')({ storeAsString: true })
axios.defaults.transformResponse = [(data) => {
  return JSONbig.parse(data)
}]

const stdRejection = (reject) => (error) => {
  reject(error)
}

const stdResolve = (resolve, reject) => (response) => {
  if (response.data.error) {
    reject(response.data.error)
  } else {
    resolve(response.data.response)
  }
}

// If you want to edit this file, talk to @titpetric before :)

class CRM {
  constructor (baseLink, jwt) {
    this.baseLink = baseLink || 'https://crm.api.latest.rustbucket.io'
    this.headers = {}
    this.setJWT(jwt)
  }

  setJWT (jwt) {
    if (jwt) {
      this.jwt = jwt
      this.headers = {
        Authorization: 'Bearer ' + this.jwt,
      }
    }
  }

  async fieldList () {
    const endpoint = `${this.baseLink}/field/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {},
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async fieldType (id) {
    const endpoint = `${this.baseLink}/field/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {},
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleList (query) {
    const endpoint = `${this.baseLink}/module/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        headers: this.headers,
        params: {
          'query': query,
        },
        data: {},
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleCreate (name, fields) {
    const endpoint = `${this.baseLink}/module/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
          'fields': fields,
        },
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleRead (id) {
    const endpoint = `${this.baseLink}/module/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {},
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleEdit (id, name, fields) {
    const endpoint = `${this.baseLink}/module/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
          'fields': fields,
        },
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleDelete (id) {
    const endpoint = `${this.baseLink}/module/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'DELETE',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {},
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleContentList (module) {
    const endpoint = `${this.baseLink}/module/${module}/content`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {},
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleContentCreate (module, fields) {
    const endpoint = `${this.baseLink}/module/${module}/content`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {
          'fields': fields,
        },
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleContentRead (module, id) {
    const endpoint = `${this.baseLink}/module/${module}/content/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {},
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleContentEdit (module, id, fields) {
    const endpoint = `${this.baseLink}/module/${module}/content/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {
          'fields': fields,
        },
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }

  async moduleContentDelete (module, id) {
    const endpoint = `${this.baseLink}/module/${module}/content/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'DELETE',
        url: endpoint,
        headers: this.headers,
        params: {},
        data: {},
      }).then(stdResolve(resolve, reject), stdRejection(reject))
    })
  }
}


export default {
  install (Vue, store) {
    const client = new CRM(window.CrustConfig.crm.baseUrl, store.getters['auth/jwt'])

    Vue.prototype.$crm = client
  }
}