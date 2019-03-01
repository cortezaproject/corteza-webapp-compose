<template>
  <div>
    <div v-for="(a, index) in attachments" :key="a.attachmentID">
      <img :src="a.previewUrl" @click="openLightbox(index)" />
      {{ a }}
    </div>

    <div v-if="options.mode === 'list'">
      @todo list
    </div>

    <div v-if="options.mode === 'grid'">
      @todo icons
    </div>

    <div v-if="options.mode === 'single'">
      @todo single
    </div>

    <div v-if="options.mode === 'gallery'">
      @todo gallery
    </div>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,

  data () {
    return {
      modalPointer: undefined,
      attachments: [],
    }
  },

  computed: {
    baseUrl () {
      return window.CrustConfig.crm.baseUrl
    },
  },

  created () {
    const kind = 'page'
    this.attachments = this.options.attachments.map(() => ({}))
    // @todo migrate to one call to attachmentList({ kind, pageID })
    Promise.all(this.options.attachments.map((attachmentID) => this.$crm.attachmentDetails({ kind, attachmentID }).then((a) => a))).then(aa => {
      this.attachments = aa.map(a => {
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
