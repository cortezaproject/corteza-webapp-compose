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

  merge ({ mode, attachments = [] } = {}) {
    this.mode = (mode && modes.includes(mode)) ? mode : 'list'
    this.attachments = attachments || this.attachments
    return this
  }
}
