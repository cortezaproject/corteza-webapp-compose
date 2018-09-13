import axios from 'axios'

// If you want to edit this file, talk to @titpetric before :)

class SAM {
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

  organisationList (query) {
    const endpoint = `${this.baseLink}/organisation/`
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

  organisationCreate (name) {
    const endpoint = `${this.baseLink}/organisation/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'name': name,
      },
    })
  }

  organisationEdit (id, name) {
    const endpoint = `${this.baseLink}/organisation/${id}`
    return axios({
      method: 'PUT',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'name': name,
      },
    })
  }

  organisationRemove (id) {
    const endpoint = `${this.baseLink}/organisation/${id}`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  organisationRead (id) {
    const endpoint = `${this.baseLink}/organisation/${id}`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {
        'id': id,
      },
      data: {},
    })
  }

  organisationArchive (id) {
    const endpoint = `${this.baseLink}/organisation/${id}/archive`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  teamList (query) {
    const endpoint = `${this.baseLink}/team/`
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

  teamCreate (name, members) {
    const endpoint = `${this.baseLink}/team/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'name': name,
        'members': members,
      },
    })
  }

  teamEdit (teamID, name, members) {
    const endpoint = `${this.baseLink}/team/${teamID}`
    return axios({
      method: 'PUT',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'name': name,
        'members': members,
      },
    })
  }

  teamRead (teamID) {
    const endpoint = `${this.baseLink}/team/${teamID}`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  teamRemove (teamID) {
    const endpoint = `${this.baseLink}/team/${teamID}`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  teamArchive (teamID) {
    const endpoint = `${this.baseLink}/team/${teamID}/archive`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  teamMove (teamID, organisationId) {
    const endpoint = `${this.baseLink}/team/${teamID}/move`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'organisation_id': organisationId,
      },
    })
  }

  teamMerge (teamID, destination) {
    const endpoint = `${this.baseLink}/team/${teamID}/merge`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'destination': destination,
      },
    })
  }

  channelList () {
    const endpoint = `${this.baseLink}/channel/`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  channelCreate (name, topic) {
    const endpoint = `${this.baseLink}/channel/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'name': name,
        'topic': topic,
      },
    })
  }

  channelEdit (channelID, name, topic, archive, organisationID) {
    const endpoint = `${this.baseLink}/channel/${channelID}`
    return axios({
      method: 'PUT',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'name': name,
        'topic': topic,
        'archive': archive,
        'organisationID': organisationID,
      },
    })
  }

  channelRead (channelID) {
    const endpoint = `${this.baseLink}/channel/${channelID}`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  channelDelete (channelID) {
    const endpoint = `${this.baseLink}/channel/${channelID}`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  channelMembers (channelID) {
    const endpoint = `${this.baseLink}/channel/${channelID}/members`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  channelJoin (channelID, userID) {
    const endpoint = `${this.baseLink}/channel/${channelID}/members/${userID}/join`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  channelPart (channelID, userID) {
    const endpoint = `${this.baseLink}/channel/${channelID}/members/${userID}/part`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  channelInvite (channelID, userID) {
    const endpoint = `${this.baseLink}/channel/${channelID}/invite`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'userID': userID,
      },
    })
  }

  channelAttach (channelID, upload) {
    const endpoint = `${this.baseLink}/channel/${channelID}/attach`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'upload': upload,
      },
    })
  }

  messageCreate (message) {
    const endpoint = `${this.baseLink}/message/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'message': message,
      },
    })
  }

  messageHistory (lastMessageID) {
    const endpoint = `${this.baseLink}/message/`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {
        'lastMessageID': lastMessageID,
      },
      data: {},
    })
  }

  messageEdit (messageID, message) {
    const endpoint = `${this.baseLink}/message/${messageID}`
    return axios({
      method: 'PUT',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'message': message,
      },
    })
  }

  messageDelete (messageID) {
    const endpoint = `${this.baseLink}/message/${messageID}`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  messageSearch (query, messageType) {
    const endpoint = `${this.baseLink}/message/search`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {
        'query': query,
        'message_type': messageType,
      },
      data: {},
    })
  }

  messagePin (messageID) {
    const endpoint = `${this.baseLink}/message/${messageID}/pin`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  messageUnpin (messageID) {
    const endpoint = `${this.baseLink}/message/${messageID}/pin`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  messageFlag (messageID) {
    const endpoint = `${this.baseLink}/message/${messageID}/flag`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  messageUnflag (messageID) {
    const endpoint = `${this.baseLink}/message/${messageID}/flag`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  messageReact (messageID, reaction) {
    const endpoint = `${this.baseLink}/message/${messageID}/reaction/${reaction}`
    return axios({
      method: 'PUT',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  messageUnreact (messageID, reaction) {
    const endpoint = `${this.baseLink}/message/${messageID}/react/${reaction}`
    return axios({
      method: 'DELETE',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  attachmentOriginal () {
    const endpoint = `${this.baseLink}/attachment/${name}`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  attachmentPreview () {
    const endpoint = `${this.baseLink}/attachment/${name}/preview`
    return axios({
      method: 'GET',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {},
    })
  }

  userSearch (query) {
    const endpoint = `${this.baseLink}/user/`
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

  userMessage (userID, message) {
    const endpoint = `${this.baseLink}/user/${userID}/message`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
      data: {
        'message': message,
      },
    })
  }

  authLogin (username, password) {
    const endpoint = `${this.baseLink}/auth/`
    return axios({
      method: 'POST',
      url: endpoint,
      headers: this.headers,
      params: {},
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
      params: {},
      data: {
        'name': name,
        'email': email,
        'username': username,
        'password': password,
      },
    })
  }
}

export default SAM
