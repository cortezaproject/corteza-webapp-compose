<template>
  <div>
    <div v-for="a in attachments" :key="a.attachmentID">
      <img :src="a.previewUrl" />
    </div>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      attachments: [],
    }
  },

  computed: {
    baseUrl () {
      return window.CrustConfig.crm.baseUrl
    },
  },

  created () {
    const { recordID, moduleID } = this.record.moduleID
    this.$crm.attachmentList({ kind: 'record', recordID, moduleID, fieldName: this.field.name }).then(({ attachments }) => {
      this.attachments = attachments.map(a => {
        a.previewUrl = this.baseUrl + a.previewUrl
        a.url = this.baseUrl + a.url
        return a
      })
    })
  },
}
</script>

<style>
.multiline {
  white-space: pre-line;
}
</style>
