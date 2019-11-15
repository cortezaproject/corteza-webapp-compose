<template>
  <b-card no-body class="editor rt-content">
    <b-card-header>
      <r-header
        :editor="editor"
        :formats="toolbar" />

    </b-card-header>

    <b-card-body>
      <editor-content
        class="editor__content"
        :editor="editor" />

    </b-card-body>
  </b-card>
</template>

<script>
import RHeader from './RToolbar'
import { Editor, EditorContent } from 'tiptap'
import { getFormats, getToolbar } from './lib'

export default {
  components: {
    EditorContent,
    RHeader,
  },

  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
  },

  data () {
    const formats = getFormats()
    return {
      formats,
      toolbar: getToolbar(),
      // Helper to determine if current content differes from prop's content
      emittedContent: false,

      editor: new Editor({
        extensions: formats,
        content: this.value,

        /**
         * Handle on update events. Process current document & update data model
         * @note Currently, build-in toHTML function removes empty lines.
         * Because of this, we are using `view.dom.innerHTML`. This should be improved at a later point
         */
        onUpdate: () => {
          this.emittedContent = true
          this.$emit('input', this.editor.view.dom.innerHTML)
        },
      }),
    }
  },

  watch: {
    value: {
      handler: function (val) {
        // Update happened due to external content change, not model change
        if (!this.emittedContent) {
          this.editor.setContent(val)
          this.correctSelection()
        }

        this.emittedContent = false
      },
      deep: true,
    },
  },

  beforeDestroy () {
    this.editor.destroy()
  },
}
</script>
