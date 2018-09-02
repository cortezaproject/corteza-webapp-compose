import axios from 'axios'

// If you want to edit this file, talk to @titpetric before :)

class Client {
  constructor (baseLink, jwt) {
    this.baseLink = baseLink || 'https://api.crm.crust.kendu.si'
    this.jwt = jwt
    this.headers = {}
    if (jwt) {
      this.headers = {
        Authorization: 'Bearer ' + this.jwt,
      }
    }
  }

  fieldList () {
    const endpoint = `${this.baseLink}/field/`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      data: {},
    })
  }

  fieldType (id) {
    const endpoint = `${this.baseLink}/field/${id}`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      data: {},
    })
  }

  moduleList (query) {
    const endpoint = `${this.baseLink}/module/`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      data: {
        'query': query,
      },
    })
  }

  moduleCreate (name) {
    const endpoint = `${this.baseLink}/module/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'name': name,
      },
    })
  }

  moduleRead (id) {
    const endpoint = `${this.baseLink}/module/${id}`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      data: {},
    })
  }

  moduleEdit (id, name) {
    const endpoint = `${this.baseLink}/module/${id}`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'name': name,
      },
    })
  }

  moduleDelete (id) {
    const endpoint = `${this.baseLink}/module/${id}`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      data: {},
    })
  }

  moduleContentList (module) {
    const endpoint = `${this.baseLink}/module/${module}/content`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      data: {},
    })
  }

  moduleContentCreate (module, payload) {
    const endpoint = `${this.baseLink}/module/${module}/content`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'payload': payload,
      },
    })
  }

  moduleContentRead (module, id) {
    const endpoint = `${this.baseLink}/module/${module}/content/${id}`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      data: {},
    })
  }

  moduleContentEdit (module, id, payload) {
    const endpoint = `${this.baseLink}/module/${module}/content/${id}`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'payload': payload,
      },
    })
  }

  moduleContentDelete (module, id) {
    const endpoint = `${this.baseLink}/module/${module}/content/${id}`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      data: {},
    })
  }
}

export default Client