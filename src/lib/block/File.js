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
  constructor (o = {}) {
    this.mode = (o.mode && modes.includes(o.mode)) ? o.mode : 'list'
    this.attachments = o.attachments || this.attachments || []
  }
}
