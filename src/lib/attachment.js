
export default class Attachment {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ attachmentID, ownerID, url, previewUrl, meta, name, createdAt, updatedAt }) {
    const { baseUrl } = window.CrustConfig.crm
    console.log(baseUrl)

    this.attachmentID = (typeof attachmentID === 'string' ? attachmentID : this.attachmentID) || ''
    this.previewUrl = baseUrl + previewUrl
    this.url = baseUrl + url
    this.download = baseUrl + url + '?download=1'
    this.ownerID = ownerID
    this.meta = meta
    this.name = name
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }
}
