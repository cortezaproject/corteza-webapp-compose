export const modes = [
  // list of attachments, no preview
  'list',
  // grid of icons
  'grid',
  // single (first) image/file, show preview
  'single',
  // list of all images/files, show preview
  'gallery',
]

export class File {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ allowImages, allowDocuments, maxSize, mode } = {}) {
    this.allowImages = !!allowImages
    this.allowDocuments = !!allowDocuments
    this.maxSize = maxSize || this.maxSize
    this.mode = (mode && modes.includes(mode)) ? mode : 'list'

    return this
  }

  export () {
    return {
      allowImages: this.allowImages,
      allowDocuments: this.allowDocuments,
      maxSize: this.maxSize,
      mode: this.mode,
    }
  }
}
