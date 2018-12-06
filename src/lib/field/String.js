export class String {
  constructor (def = {}) {
    this.merge(def)
  }

  merge ({ multiLine, useRichTextEditor, multiValue, allowDuplicates } = {}) {
    this.multiLine = !!multiLine
    this.useRichTextEditor = !!useRichTextEditor

    return this
  }
}
