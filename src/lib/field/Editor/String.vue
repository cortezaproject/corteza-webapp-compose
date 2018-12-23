<template>
  <div class="form-group">
    {{ field.label || field.name }}
    <quill-editor
      v-if="field.options.useRichTextEditor"
      v-model="value"
      ref="myQuillEditor"></quill-editor>
    <b-form-textarea
      v-else-if="field.options.multiLine"
      v-model="value"></b-form-textarea>
    <b-form-input
      v-else
      v-model="value"></b-form-input>
  </div>
</template>
<script>
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import base from './base'

export default {
  extends: base,
  components: {
    quillEditor,
  },
}
</script>
