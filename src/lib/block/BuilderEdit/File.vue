<template>
  <div>
   <uploader :endpoint="endpoint" @uploaded="appendAttachment" />
    <list-loader kind="page"
                 :set="options.attachments"
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
  },

  methods: {
    appendAttachment ({ attachmentID }) {
      this.options.attachments.push(attachmentID)
    },
  },
}
</script>
