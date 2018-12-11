<template>
  <div class="form-group">
    {{ field.label || field.name }}
    <b-form-textarea
      v-if="field.options.multiLine && !field.options.useRichTextEditor"
      v-model="value"></b-form-textarea>
    <quill-editor v-model="value"
                ref="myQuillEditor"
                v-if="field.options.multiLine && field.options.useRichTextEditor"
                :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @ready="onEditorReady($event)">
    </quill-editor>
    <b-form-input
      v-if="!field.options.multiLine"
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
