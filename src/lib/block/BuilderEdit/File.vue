<template>
  <div>
    <b-form-group vertical label="">
      <vue-dropzone
        ref="dropzone"
        id="dropzone"
        :useCustomSlot=true
        @vdropzone-success="onSuccess"
        :options="dzOptions">
        <h2>Drop files to upload....</h2>
      </vue-dropzone>
    </b-form-group>
  </div>
</template>
<script>
import base from './base'
import vueDropzone from 'vue2-dropzone'

export default {
  components: {
    vueDropzone,
  },

  extends: base,
  name: 'File',

  computed: {
    dzOptions () {
      return {
        paramName: 'upload',
        maxFilesize: 100, // mb
        url: () => {
          return `${this.baseUrl}/page/${this.pageID}/attachment`
        },
        thumbnailMethod: 'contain',
        thumbnailWidth: 320,
        thumbnailHeight: 180,
        maxFiles: 1000,
        withCredentials: true,
        autoProcessQueue: true,
        // addRemoveLinks: false,
        // disablePreview: true,
        uploadMultiple: false,
        parallelUploads: 1,
        dictRemoveFile: 'Remove',
        headers: {
          // https://github.com/enyo/dropzone/issues/1154
          'Cache-Control': '',
          'X-Requested-With': '',
        },
      }
    },

    dropzone () {
      return this.$refs.dropzone.dropzone
    },

    baseUrl () {
      return window.CrustConfig.crm.baseUrl
    },
  },

  created () {
    const kind = 'page'
    this.attachments = this.options.attachments.map(() => ({}))
    // @todo migrate to one call to attachmentList({ kind, pageID })
    this.options.attachments.forEach((attachmentID) => {
      this.$crm.attachmentDetails({ kind, attachmentID }).then((attachment) => {
        const { name, previewUrl, meta } = attachment
        const existing = { name, size: meta.original.size, attachment }
        this.dropzone.emit('addedfile', existing)
        this.dropzone.options.thumbnail.call(this.dropzone, existing, this.baseUrl + previewUrl)
        // Make sure that there is no progress bar, etc...
        this.dropzone.emit('complete', existing)
      })
    })
  },

  methods: {
    onSuccess (file, { response }) {
      const { attachmentID, previewUrl } = response
      this.options.attachments.push(attachmentID)
      this.dropzone.emit('thumbnail', file, this.baseUrl + previewUrl)
    },
  },
}
</script>

<style lang="scss" scoped>
  .ql-snow.ql-toolbar button {
    width: 27px;
  }
</style>
