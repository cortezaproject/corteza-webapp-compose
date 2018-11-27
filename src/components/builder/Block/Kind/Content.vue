<template>
    <div>
        <fieldset class="form-group">
            <quill-editor v-model="o.body" :options="quillOptions"></quill-editor>
        </fieldset>
    </div>
</template>
<script>
import { Content } from '@/lib/block/Content'
import { quillEditor } from 'vue-quill-editor'

// Quill styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

export default {
  name: 'Content',
  props: {
    options: {
      type: Object,
      default () { return new Content() },
    },
  },

  computed: {
    o: {
      get () {
        return this.options
      },

      set (o) {
        this.$emit('update:options', o)
      },
    },
  },

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
}
</script>
