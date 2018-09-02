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

  moduleCreate (name, fields) {
    const endpoint = `${this.baseLink}/module/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'name': name,
        'fields': fields,
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

  moduleEdit (id, name, fields) {
    const endpoint = `${this.baseLink}/module/${id}`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'name': name,
        'fields': fields,
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

  moduleContentCreate (module, fields) {
    const endpoint = `${this.baseLink}/module/${module}/content`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'fields': fields,
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

  moduleContentEdit (module, id, fields) {
    const endpoint = `${this.baseLink}/module/${module}/content/${id}`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'fields': fields,
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