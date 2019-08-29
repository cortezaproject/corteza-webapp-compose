<template>
  <vue-dropzone
    ref="dropzone"
    id="dropzone"
    :use-custom-slot=true
    :include-styling=false
    @vdropzone-success="onSuccess"
    @vdropzone-upload-progress="onUploadProgress"
    :options="dzOptions">
    <div class="w-100 h-100 position-relative bg-light">
      <template v-if="active">
        <div class="bg-primary h-100 progress-bar position-absolute"
             :style="progresBarStyle"></div>

        <span class="d-flex align-items-center h-100 w-100 uploading justify-content-center position-relative py-2">
          {{ $t('general.label.uploading') }} {{ active.file.name }} ({{ size(active.file) }})
        </span>
      </template>
      <div v-else
           class="d-flex align-items-center h-100 w-100 p-2 droparea justify-content-center mb-2">{{ label || $t('general.label.dropFiles') }}</div>

    </div>
  </vue-dropzone>
</template>
<script>
import numeral from 'numeral'
import vueDropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

export default {

  components: {
    vueDropzone,
  },

  props: {
    endpoint: {
      type: String,
      required: true,
    },
    acceptedFiles: {
      type: String,
      default: null,
    },
    label: {
      type: String,
      default: null,
    },
  },

  data () {
    return {
      active: null,
    }
  },

  computed: {
    dzOptions () {
      return {
        paramName: 'upload',
        maxFilesize: 100, // mb
        url: () => this.baseUrl + this.endpoint,
        thumbnailMethod: 'contain',
        thumbnailWidth: 320,
        thumbnailHeight: 180,
        maxFiles: 1000,
        withCredentials: true,
        autoProcessQueue: true,
        disablePreview: true,
        uploadMultiple: false,
        parallelUploads: 1,
        acceptedFiles: this.acceptedFiles,
        headers: {
          // https://github.com/enyo/dropzone/issues/1154
          'Cache-Control': '',
          'X-Requested-With': '',
          'Authorization': 'Bearer ' + this.$auth.JWT,
        },
        addedfile (file) {},
      }
    },

    dropzone () {
      return (this.$refs.dropzone && this.$refs.dropzone.dropzone) ? this.$refs.dropzone.dropzone : false
    },

    baseUrl () {
      return window.ComposeAPI
    },

    progresBarStyle () {
      return {
        width: this.active.progress + '%',
      }
    },
  },

  methods: {
    size (a) {
      return numeral(a.size).format('0b')
    },

    onSuccess (file, { response }) {
      this.active = null
      this.$emit('uploaded', response)
    },

    onUploadProgress (file, progress, bytesSent) {
      this.active = { file, progress, bytesSent }
    },
  },
}
</script>

<style lang="scss" scoped>
#dropzone /deep/ .dz-message {
  height: 100%;
}

div {
  .droparea {
    cursor: pointer;
  }

  .progress-bar {
    width: 0;
    opacity: 0.3;
  }

  .uploading {
    background-size: 100% 100%;
    background-position: right bottom;
    cursor: wait;
  }
}
</style>
