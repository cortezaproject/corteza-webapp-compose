<template>
  <div>
    <b-form-group horizontal
                  description="How files are represented in record page blocks"
                  label="View mode">
      <b-form-radio-group v-model="options.mode"
                          buttons
                          button-variant="outline-secondary"
                          size="sm"
                          name="buttons2"
                          :options="modes">
      </b-form-radio-group>
    </b-form-group>
   <uploader :endpoint="endpoint" @uploaded="appendAttachment" />
    <list-loader kind="page"
                 enable-delete
                 :set.sync="options.attachments"
                 mode="list"></list-loader>
  </div>
</template>
<script>
import base from './base'
import Uploader from '@/components/Public/Page/Attachment/Uploader'
import ListLoader from '@/components/Public/Page/Attachment/ListLoader'

export default {
  extends: base,
  name: 'File',

  components: {
    Uploader,
    ListLoader,
  },

  computed: {
    endpoint () {
      const { pageID } = this.page
      return `/page/${pageID}/attachment`
    },

    modes () {
      return [
        { value: 'list', text: 'List' },
        { value: 'grid', text: 'Grid' },
        { value: 'single', text: 'Single image' },
        { value: 'gallery', text: 'Gallery of images' },
      ]
    },
  },

  methods: {
    appendAttachment ({ attachmentID }) {
      this.options.attachments.push(attachmentID)
    },
  },
}
</script>
