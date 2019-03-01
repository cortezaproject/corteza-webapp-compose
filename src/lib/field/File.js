export const modes = [
  // list of attachments, no preview
  'list',
  // grid of icons
  'icons',
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
    this.mode = modes.includes(mode) || 'list'
    return this
  }
}
