export class String {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ multiLine, useRichTextEditor } = {}) {
    this.multiLine = !!multiLine
    this.useRichTextEditor = !!useRichTextEditor

    return this
  }

  export () {
    return {
      multiLine: this.multiLine,
      useRichTextEditor: this.useRichTextEditor,
    }
  }
}
