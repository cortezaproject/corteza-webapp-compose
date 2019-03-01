<template>
  <b-form-group :label="field.label || field.name">
    <attachment-uploader :endpoint="endpoint" @uploaded="appendAttachment" />
    {{ value }}
  </b-form-group>
</template>
<script>
import base from './base'
import AttachmentUploader from '@/components/Public/Page/Attachment/Uploader'

export default {
  components: {
    AttachmentUploader,
  },

  extends: base,

  computed: {
    endpoint () {
      const { moduleID, recordID } = this.record
      const { name } = this.field
      return `/module/${moduleID}/record/${recordID}/${name}/attachment`
    },
  },

  methods: {
    appendAttachment ({ attachmentID }) {
      if (this.field.isMulti) {
        this.value.push(attachmentID)
      } else {
        this.value = attachmentID
      }
    },
  },
}
</script>
