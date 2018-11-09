import axios from 'axios'

// If you want to edit this file, talk to @titpetric before :)

// As this file is generated, any mock calls should go into
// the related *_mock.js file; please don't modify this file.

class CRM {
  constructor (baseLink) {
    this.baseLink = baseLink || 'https://crm.api.latest.rustbucket.io'
    this.headers = {
      'Content-Type': 'application/json',
    }
  }

  baseURL () {
    return this.baseLink
  }

  stdReject (reject) {
    return (error) => {
      reject(error)
    }
  }

  stdResolve (resolve, reject) {
    return (response) => {
      if (response.data.error) {
        reject(response.data.error)
      } else {
        resolve(response.data.response)
      }
    }
  }

  async fieldList () {
    const endpoint = `${this.baseLink}/field/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async fieldType ({ typeID }) {
    const endpoint = `${this.baseLink}/field/${typeID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async pageList ({ selfID }) {
    const endpoint = `${this.baseLink}/page/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'selfID': selfID,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async pageCreate ({ selfID, moduleID, title, description, visible, blocks }) {
    const endpoint = `${this.baseLink}/page/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'selfID': selfID,
          'moduleID': moduleID,
          'title': title,
          'description': description,
          'visible': visible,
          'blocks': blocks,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async pageRead ({ pageID }) {
    const endpoint = `${this.baseLink}/page/${pageID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async pageEdit ({ pageID, selfID, moduleID, title, description, visible, blocks }) {
    const endpoint = `${this.baseLink}/page/${pageID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'selfID': selfID,
          'moduleID': moduleID,
          'title': title,
          'description': description,
          'visible': visible,
          'blocks': blocks,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async pageReorder ({ selfID, pageIDs }) {
    const endpoint = `${this.baseLink}/page/${selfID}/reorder`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'pageIDs': pageIDs,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async pageDelete ({ pageID }) {
    const endpoint = `${this.baseLink}/page/${pageID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'DELETE',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleList ({ query }) {
    const endpoint = `${this.baseLink}/module/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'query': query,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleCreate ({ name, fields }) {
    const endpoint = `${this.baseLink}/module/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
          'fields': fields,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleRead ({ moduleID }) {
    const endpoint = `${this.baseLink}/module/${moduleID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleChart ({ moduleID, name, description, xAxis, xMin, xMax, yAxis, groupBy, sum, count, kind }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/chart`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'name': name,
          'description': description,
          'xAxis': xAxis,
          'xMin': xMin,
          'xMax': xMax,
          'yAxis': yAxis,
          'groupBy': groupBy,
          'sum': sum,
          'count': count,
          'kind': kind,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleEdit ({ moduleID, name, fields }) {
    const endpoint = `${this.baseLink}/module/${moduleID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
          'fields': fields,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleDelete ({ moduleID }) {
    const endpoint = `${this.baseLink}/module/${moduleID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'DELETE',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleContentList ({ moduleID, query, page, perPage }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/content`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'query': query,
          'page': page,
          'perPage': perPage,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleContentCreate ({ moduleID, fields }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/content`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'fields': fields,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleContentRead ({ moduleID, contentID }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/content/${contentID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleContentEdit ({ moduleID, contentID, fields }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/content/${contentID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'fields': fields,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleContentDelete ({ moduleID, contentID }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/content/${contentID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'DELETE',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }
}

export default {
  install (Vue, store) {
    const client = new CRM(window.CrustConfig.crm.baseUrl)

    Vue.prototype.$crm = client
  },
}
