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

  async pageList ({ selfID, recordPagesOnly }) {
    const endpoint = `${this.baseLink}/page/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'selfID': selfID,
          recordPagesOnly,
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

  async pageTree () {
    const endpoint = `${this.baseLink}/page/tree`
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

  async moduleEdit ({ moduleID, name, fields, meta }) {
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
          meta,
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

  async moduleRecordList ({ moduleID, filter, page, perPage, sort }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/record`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'filter': filter,
          'page': page,
          'perPage': perPage,
          sort,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleRecordReport ({ moduleID, metrics, dimensions, filter }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/report`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'metrics': metrics,
          'dimensions': dimensions,
          filter,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async moduleRecordCreate ({ moduleID, fields }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/record`
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

  async moduleRecordRead ({ moduleID, recordID }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/record/${recordID}`
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

  async moduleRecordEdit ({ moduleID, recordID, fields }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/record/${recordID}`
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

  async moduleRecordDelete ({ moduleID, recordID }) {
    const endpoint = `${this.baseLink}/module/${moduleID}/record/${recordID}`
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

  async chartList () {
    const endpoint = `${this.baseLink}/chart/`
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

  async chartCreate ({ name, fields }) {
    const endpoint = `${this.baseLink}/chart/`
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

  async chartRead ({ chartID }) {
    const endpoint = `${this.baseLink}/chart/${chartID}`
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

  async chartEdit ({ chartID, name, config }) {
    const endpoint = `${this.baseLink}/chart/${chartID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          name,
          config,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async chartDelete ({ chartID }) {
    const endpoint = `${this.baseLink}/chart/${chartID}`
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
