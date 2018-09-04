import axios from 'axios'

// If you want to edit this file, talk to @titpetric before :)

class auth {
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

  authLogin (username, password) {
    const endpoint = `${this.baseLink}/auth/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'username': username,
        'password': password,
      },
    })
  }

  authCreate (name, email, username, password) {
    const endpoint = `${this.baseLink}/auth/create`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      data: {
        'name': name,
        'email': email,
        'username': username,
        'password': password,
      },
    })
  }
}

export default auth