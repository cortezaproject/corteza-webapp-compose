<template>
    <div>
        <fieldset class="form-group">
            <quill-editor v-model="o.body" :options="quillOptions"></quill-editor>
        </fieldset>
    </div>
</template>
<script>
import optionsSyncProp from './mixins/optionsSyncProp.js'
import { quillEditor } from 'vue-quill-editor'

// Quill styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

export default {
  name: 'Content',

  data () {
    return {
      quillOptions: {
        modules: {
          toolbar: [
            // toggled buttons
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],

            // custom button values
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],

            // superscript/subscript
            // [{ 'script': 'sub' }, { 'script': 'super' }],

            // outdent/indent
            [{ 'indent': '-1' }, { 'indent': '+1' }],

            // text direction
            // [{ 'direction': 'rtl' }],

            // custom dropdown
            // [{'size': ['small', false, 'large', 'huge']}],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

            // dropdown with defaults from theme
            // [{ 'color': [] }, { 'background': [] }],
            // [{ 'font': [] }],
            [{ 'align': [] }],

            // remove formatting button
            ['clean'],
          ],
        },
      },
    }
  },

  components: {
    quillEditor,
  },

  mixins: [
    optionsSyncProp,
  ],
}
</script>
