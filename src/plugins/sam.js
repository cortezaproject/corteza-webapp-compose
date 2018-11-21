import axios from 'axios'

// If you want to edit this file, talk to @titpetric before :)

// As this file is generated, any mock calls should go into
// the related *_mock.js file; please don't modify this file.

class SAM {
  constructor (baseLink) {
    this.baseLink = baseLink || 'https://sam.api.latest.rustbucket.io'
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

  async channelList () {
    const endpoint = `${this.baseLink}/channels/`
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

  async channelCreate ({ name, topic, type, members }) {
    const endpoint = `${this.baseLink}/channels/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
          'topic': topic,
          'type': type,
          'members': members,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async channelUpdate ({ channelID, name, topic, type, organisationID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'name': name,
          'topic': topic,
          'type': type,
          'organisationID': organisationID,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async channelState ({ channelID, state }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/state`
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'state': state,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async channelRead ({ channelID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}`
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

  async channelMembers ({ channelID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/members`
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

  async channelJoin ({ channelID, userID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/members/${userID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async channelPart ({ channelID, userID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/members/${userID}`
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

  async channelInvite ({ channelID, userID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/invite`
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

  async channelAttach ({ channelID, replyTo, upload }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/attach`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'replyTo': replyTo,
          'upload': upload,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async messageCreate ({ channelID, message }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'message': message,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async messageHistory ({ channelID, lastMessageID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'lastMessageID': lastMessageID,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async messageEdit ({ channelID, messageID, message }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'PUT',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'message': message,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async messageDelete ({ channelID, messageID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}`
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

  async messageReplyGet ({ channelID, messageID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/replies`
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

  async messageReplyCreate ({ channelID, messageID, message }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/replies`
    return new Promise((resolve, reject) => {
      axios({
        method: 'POST',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {},
        data: {
          'message': message,
        },
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async messageMarkAsUnread ({ channelID, messageID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/unread`
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

  async messagePinCreate ({ channelID, messageID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/pin`
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

  async messagePinRemove ({ channelID, messageID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/pin`
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

  async messageBookmarkCreate ({ channelID, messageID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/bookmark`
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

  async messageBookmarkRemove ({ channelID, messageID }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/bookmark`
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

  async messageReactionCreate ({ channelID, messageID, reaction }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/reaction/${reaction}`
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

  async messageReactionRemove ({ channelID, messageID, reaction }) {
    const endpoint = `${this.baseLink}/channels/${channelID}/messages/${messageID}/reaction/${reaction}`
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

  async attachmentOriginal ({ attachmentID, name, download }) {
    const endpoint = `${this.baseLink}/attachment/${attachmentID}/original/${name}`
    return new Promise((resolve, reject) => {
      axios({
        method: 'GET',
        url: endpoint,
        withCredentials: true,
        headers: this.headers,
        params: {
          'download': download,
        },
        data: {},
      }).then(this.stdResolve(resolve, reject), this.stdReject(reject))
    })
  }

  async attachmentPreview ({ attachmentID, ext }) {
    const endpoint = `${this.baseLink}/attachment/${attachmentID}/preview.${ext}`
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

  async searchMessages ({ query }) {
    const endpoint = `${this.baseLink}/search/messages`
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
}

export default {
  install (Vue, store) {
    const client = new SAM(window.CrustConfig.sam.baseUrl)

    Vue.prototype.$sam = client
  },
}
