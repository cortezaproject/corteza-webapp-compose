<template>
  <b-form-group :label="field.label || field.name">
    <vue-dropzone
      ref="dropzone"
      id="dropzone"
      :useCustomSlot=true
      @vdropzone-success="onSuccess"
      :options="options">
      <h2>Drop files to upload....</h2>
    </vue-dropzone>
    --{{ options.url() }}..
  </b-form-group>
</template>
<script>
import base from './base'
import vueDropzone from 'vue2-dropzone'

export default {
  components: {
    vueDropzone,
  },

  extends: base,

  computed: {
    options () {
      return {
        paramName: 'upload',
        maxFilesize: 100, // mb
        url: () => {
          const { moduleID, recordID } = this.record
          const { name } = this.field
          return `${window.CrustConfig.crm.baseUrl}/module/${moduleID}/record/${recordID}/${name}/attachment`
        },
        params: { field: this.field.name },
        thumbnailMethod: 'contain',
        thumbnailWidth: 320,
        thumbnailHeight: 180,
        maxFiles: this.field.isMulti ? null : 1,
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
      return this.$refs.dropzone
    },
  },

  methods: {
    onSuccess (file, { response }) {
      const { attachmentID, previewUrl } = response

      if (this.field.isMulti) {
        this.value.push(attachmentID)
      } else {
        this.value = attachmentID
      }
      this.dropzone.dropzone.emit('thumbnail', file, window.CrustConfig.crm.baseUrl + previewUrl)
    },
  },
}
</script>
<style scoped>
.active {
  color: #78CB5B;
}

.inactive {
  color: #fff000;
}

.fa.fa-circle::before {
  content: "\25C9";

  /* color: #000; */
}

th {
  text-align: center;
}

td:nth-child(1) {
  text-align: center;
}

td:nth-child(3) {
  text-align: center;
}

td:nth-child(2) {
  padding-left: 40px;
}

.event-active {
  font-weight: bold;
  color: #78CB5B;
  text-transform: uppercase;
  letter-spacing: 1.2px;
}
</style>
