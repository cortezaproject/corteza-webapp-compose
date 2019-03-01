<template>
  <div>
    <div v-for="a in attachments" :key="a.attachmentID">
      <img :src="a.previewUrl" />
    </div>

    <div v-if="field.options.mode === 'list'">
      @todo list
      {{ attachments }}
    </div>

    <div v-if="field.options.mode === 'icons'">
      @todo icons
      {{ attachments }}
    </div>

    <div v-if="field.options.mode === 'single'">
      @todo single
      {{ attachments }}
    </div>

    <div v-if="field.options.mode === 'gallery'">
      @todo gallery
      {{ attachments }}
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
        a.download = a.url + '?download=1'
        return a
      })
    })
  },
}
</script>
