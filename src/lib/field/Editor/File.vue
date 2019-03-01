<template>
  <b-form-group :label="field.label || field.name">
    <vue-dropzone
      ref="dropzone"
      id="dropzone"
      :useCustomSlot=true
      @vdropzone-success="onSuccess"
      :options="dzOptions">
      <h2>Drop files to upload....</h2>
    </vue-dropzone>
  </b-form-group>
</template>
<script>
import base from './base'
import vueDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {
  components: {
    vueDropzone,
  },

  extends: base,

  computed: {
    dzOptions () {
      return {
        paramName: 'upload',
        maxFilesize: 100, // mb
        url: () => {
          const { moduleID, recordID } = this.record
          const { name } = this.field
          return `${this.baseUrl}/module/${moduleID}/record/${recordID}/${name}/attachment`
        },
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
      return (this.$refs.dropzone && this.$refs.dropzone.dropzone) ? this.$refs.dropzone.dropzone : false
    },

    baseUrl () {
      return window.CrustConfig.crm.baseUrl
    },
  },

  created () {
    const { recordID, moduleID } = this.record

    this.$crm.attachmentList({ kind: 'record', recordID, moduleID, fieldName: this.field.name }).then(({ attachments }) => {
      attachments.forEach(attachment => {
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

      if (this.field.isMulti) {
        this.value.push(attachmentID)
      } else {
        this.value = attachmentID
      }
      this.dropzone.emit('thumbnail', file, this.baseUrl + previewUrl)
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
