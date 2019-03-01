<template>
  <div>
    <div v-for="a in attachments" :key="a.attachmentID">
      <img :src="a.previewUrl" @click="openLightbox(index)" />
    </div>

    <div v-if="field.options.mode === 'list'">
      @todo list
      {{ attachments }}
    </div>

    <div v-if="field.options.mode === 'grid'">
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
    const { recordID, moduleID } = this.record
    this.$crm.attachmentList({ kind: 'record', recordID, moduleID, fieldName: this.field.name }).then(({ attachments }) => {
      this.attachments = attachments.map(a => {
        a.previewUrl = this.baseUrl + a.previewUrl
        a.url = this.baseUrl + a.url
        a.download = a.url + '?download=1'
        return a
      })
    })
  },

  methods: {
    openLightbox (index) {
      this.$root.$emit('showAttachmentsModal', index, this.attachments)
    },
  },
}
</script>
