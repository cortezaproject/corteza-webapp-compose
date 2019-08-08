export class String {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ multiLine, useRichTextEditor, multiDelimiter } = {}) {
    this.multiLine = !!multiLine
    this.useRichTextEditor = !!useRichTextEditor
    this.multiDelimiter = multiDelimiter ? (typeof multiDelimiter === 'string' ? multiDelimiter : '\n') : this.multiDelimiter

    return this
  }

  export () {
    return {
      multiLine: this.multiLine,
      useRichTextEditor: this.useRichTextEditor,
    }
  }
}
