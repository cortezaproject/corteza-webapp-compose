<template>
  <div>
   <attachment-uploader :endpoint="endpoint" @uploaded="appendAttachment" />
    {{ options.attachments }}
  </div>
</template>
<script>
import base from './base'
import AttachmentUploader from '@/components/Public/Page/Attachment/Uploader'

export default {
  extends: base,
  name: 'File',

  components: {
    AttachmentUploader,
  },

  computed: {
    endpoint () {
      const { pageID } = this.page
      return `/page/${pageID}/attachment`
    },
  },

  methods: {
    appendAttachment ({ attachmentID }) {
      this.options.attachments.push(attachmentID)
    },
  },
}
</script>
