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
    const endpoint = `${this.baseLink}/channel/`
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
    const endpoint = `${this.baseLink}/channel/`
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
    const endpoint = `${this.baseLink}/channel/${channelID}`
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
    const endpoint = `${this.baseLink}/channel/${channelID}/state`
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
    const endpoint = `${this.baseLink}/channel/${channelID}`
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
    const endpoint = `${this.baseLink}/channel/${channelID}/members`
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
    const endpoint = `${this.baseLink}/channel/${channelID}/members/${userID}`
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
    const endpoint = `${this.baseLink}/channel/${channelID}/members/${userID}`
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
    const endpoint = `${this.baseLink}/channel/${channelID}/invite`
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
    const endpoint = `${this.baseLink}/channel/${channelID}/attach`
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

  async messageCreate ({ message }) {
    const endpoint = `${this.baseLink}/message/`
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

  async messageHistory ({ lastMessageID }) {
    const endpoint = `${this.baseLink}/message/`
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

  async messageEdit ({ messageID, message }) {
    const endpoint = `${this.baseLink}/message/${messageID}`
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

  async messageDelete ({ messageID }) {
    const endpoint = `${this.baseLink}/message/${messageID}`
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

  async messageReplyGet ({ messageID }) {
    const endpoint = `${this.baseLink}/message/${messageID}/replies`
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

  async messageReplyCreate ({ messageID, message }) {
    const endpoint = `${this.baseLink}/message/${messageID}/replies`
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

  async messageMarkAsUnread ({ messageID }) {
    const endpoint = `${this.baseLink}/message/${messageID}/unread`
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

  async messagePinCreate ({ messageID }) {
    const endpoint = `${this.baseLink}/message/${messageID}/pin`
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

  async messagePinRemove ({ messageID }) {
    const endpoint = `${this.baseLink}/message/${messageID}/pin`
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

  async messageBookmarkCreate ({ messageID }) {
    const endpoint = `${this.baseLink}/message/${messageID}/bookmark`
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

  async messageBookmarkRemove ({ messageID }) {
    const endpoint = `${this.baseLink}/message/${messageID}/bookmark`
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

  async messageReactionCreate ({ messageID, reaction }) {
    const endpoint = `${this.baseLink}/message/${messageID}/reaction/${reaction}`
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

  async messageReactionRemove ({ messageID, reaction }) {
    const endpoint = `${this.baseLink}/message/${messageID}/reaction/${reaction}`
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

  async attachmentOriginal ({ name, download }) {
    const endpoint = `${this.baseLink}/attachment/original/${name}`
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

  async attachmentPreview ({ ext }) {
    const endpoint = `${this.baseLink}/attachment/preview.${ext}`
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

  async searchMessages () {
    const endpoint = `${this.baseLink}/search/messages`
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
}

export default {
  install (Vue, store) {
    const client = new SAM(window.CrustConfig.sam.baseUrl)

    Vue.prototype.$sam = client
  },
}
