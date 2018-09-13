import axios from 'axios'

// If you want to edit this file, talk to @titpetric before :)

class CRM {
  constructor (baseLink, jwt) {
    this.baseLink = baseLink
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

  fieldList () {
    const endpoint = `${this.baseLink}/field/`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  fieldType (id) {
    const endpoint = `${this.baseLink}/field/${id}`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  moduleList (query) {
    const endpoint = `${this.baseLink}/module/`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {
        'query': query,
      },
      data: {},
    })
  }

  moduleCreate (name, fields) {
    const endpoint = `${this.baseLink}/module/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
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
      params: {},
      data: {},
    })
  }

  moduleEdit (id, name, fields) {
    const endpoint = `${this.baseLink}/module/${id}`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
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
      params: {},
      data: {},
    })
  }

  moduleContentList (module) {
    const endpoint = `${this.baseLink}/module/${module}/content`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  moduleContentCreate (module, fields) {
    const endpoint = `${this.baseLink}/module/${module}/content`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
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
      params: {},
      data: {},
    })
  }

  moduleContentEdit (module, id, fields) {
    const endpoint = `${this.baseLink}/module/${module}/content/${id}`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
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
      params: {},
      data: {},
    })
  }
}

export default CRM
