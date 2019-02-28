// @todo option to allow multiple entries
// @todo option to allow duplicates
export class File {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ allowImages, allowDocuments } = {}) {
    this.allowImages = !!allowImages
    this.allowDocuments = !!allowDocuments
    return this
  }
}
