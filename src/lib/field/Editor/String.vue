<template>
  <b-form-group :label="field.label || field.name">
    <quill-editor
      v-if="field.options.useRichTextEditor"
      v-model="value"
      :options="quillOptions"
      ref="myQuillEditor"></quill-editor>
    <textarea
      v-else-if="field.options.multiLine"
      v-model="value"></textarea>
    <b-form-input
      v-else
      v-model="value"></b-form-input>

    <b-form-text v-if="validate && errors">
      <div v-for="(error, i) in errors" :key="i">{{ error }}</div>
    </b-form-text>
  </b-form-group>
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

  data () {
    return {
      quillOptions: {
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],
            ['link'],
            ['clean'],
          ],
        },
      },
    }
  },
}

</script>
<style>
textarea {
  width: 100%;
}
</style>
