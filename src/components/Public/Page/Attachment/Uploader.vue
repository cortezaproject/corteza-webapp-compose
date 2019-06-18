<template>
  <vue-dropzone
    ref="dropzone"
    id="dropzone"
    :use-custom-slot=true
    :include-styling=false
    @vdropzone-success="onSuccess"
    @vdropzone-upload-progress="onUploadProgress"
    :options="dzOptions">
    <div class="uploading position-relative" v-if="active">
      <div class="progress-bar position-absolute text-center mb-2" :style="progresBarStyle"></div>
      {{ $t('general.label.uploading') }} {{ active.file.name }} ({{ size(active.file) }})
    </div>
    <div class="droparea text-center mb-2" v-else>{{ $t('general.label.dropFiles') }}</div>
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
div {
  .droparea {
    background-color: $light;
    padding: 10px;
    cursor: pointer;

    &:hover {
      background-color: $secondary;
    }
  }

  .uploading {
    background: $light;
    background-size: 100% 100%;
    background-position: right bottom;
    padding: 10px 0;
    cursor: wait;

    .progress-bar {
      background: $primary;
      width: 0;
      height: 30px;
      opacity: 0.3;
    }
  }
}
</style>
