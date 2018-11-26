import axios from 'axios'

// If you want to edit this file, talk to @titpetric before :)

// As this file is generated, any mock calls should go into
// the related *_mock.js file; please don't modify this file.

class System {
  constructor (baseLink) {
    this.baseLink = baseLink || 'https://system.api.latest.rustbucket.io'
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

  async authCheck () {
    const endpoint = `${this.baseLink}/auth/check`
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

  async authLogin ({ username, password }) {
    const endpoint = `${this.baseLink}/auth/login`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'username': username,
          'password': password,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async authLogout () {
    const endpoint = `${this.baseLink}/auth/logout`
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

  async organisationList ({ query }) {
    const endpoint = `${this.baseLink}/organisations/`
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

  async organisationCreate ({ name }) {
    const endpoint = `${this.baseLink}/organisations/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async organisationEdit ({ id, name }) {
    const endpoint = `${this.baseLink}/organisations/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async organisationRemove ({ id }) {
    const endpoint = `${this.baseLink}/organisations/${id}`
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

  async organisationRead ({ id }) {
    const endpoint = `${this.baseLink}/organisations/${id}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'id': id,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async organisationArchive ({ id }) {
    const endpoint = `${this.baseLink}/organisations/${id}/archive`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async teamList ({ query }) {
    const endpoint = `${this.baseLink}/teams/`
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

  async teamCreate ({ name, members }) {
    const endpoint = `${this.baseLink}/teams/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
          'members': members,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async teamEdit ({ teamID, name, members }) {
    const endpoint = `${this.baseLink}/teams/${teamID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
          'members': members,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async teamRead ({ teamID }) {
    const endpoint = `${this.baseLink}/teams/${teamID}`
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

  async teamRemove ({ teamID }) {
    const endpoint = `${this.baseLink}/teams/${teamID}`
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

  async teamArchive ({ teamID }) {
    const endpoint = `${this.baseLink}/teams/${teamID}/archive`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async teamMove ({ teamID, organisationID }) {
    const endpoint = `${this.baseLink}/teams/${teamID}/move`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'organisationID': organisationID,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async teamMerge ({ teamID, destination }) {
    const endpoint = `${this.baseLink}/teams/${teamID}/merge`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'destination': destination,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async teamMemberAdd ({ teamID, userID }) {
    const endpoint = `${this.baseLink}/teams/${teamID}/memberAdd`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'userID': userID,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async teamMemberRemove ({ teamID, userID }) {
    const endpoint = `${this.baseLink}/teams/${teamID}/memberRemove`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'userID': userID,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async userList ({ query }) {
    const endpoint = `${this.baseLink}/users/`
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

  async userCreate ({ email, username, password, name, handle, kind, meta, satosaID, organisationID }) {
    const endpoint = `${this.baseLink}/users/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'email': email,
          'username': username,
          'password': password,
          'name': name,
          'handle': handle,
          'kind': kind,
          'meta': meta,
          'satosaID': satosaID,
          'organisationID': organisationID,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async userEdit ({ userID, email, username, password, name, handle, kind, meta, satosaID, organisationID }) {
    const endpoint = `${this.baseLink}/users/${userID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'email': email,
          'username': username,
          'password': password,
          'name': name,
          'handle': handle,
          'kind': kind,
          'meta': meta,
          'satosaID': satosaID,
          'organisationID': organisationID,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async userRead ({ userID }) {
    const endpoint = `${this.baseLink}/users/${userID}`
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

  async userRemove ({ userID }) {
    const endpoint = `${this.baseLink}/users/${userID}`
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

  async userSuspend ({ userID }) {
    const endpoint = `${this.baseLink}/users/${userID}/suspend`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async userUnsuspend ({ userID }) {
    const endpoint = `${this.baseLink}/users/${userID}/unsuspend`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
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
    const client = new System(window.CrustConfig.system.baseUrl)

    Vue.prototype.$system = client
  },
}
