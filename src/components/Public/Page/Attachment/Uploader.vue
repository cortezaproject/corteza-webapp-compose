<template>
  <vue-dropzone
    ref="dropzone"
    id="dropzone"
    :use-custom-slot=true
    :include-styling=false
    @vdropzone-success="onSuccess"
    :options="dzOptions">
    <div class="droparea">Click or drop files here to upload</div>
  </vue-dropzone>
</template>
<script>
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
        },
        addedfile (file) {},
      }
    },

    dropzone () {
      return (this.$refs.dropzone && this.$refs.dropzone.dropzone) ? this.$refs.dropzone.dropzone : false
    },

    baseUrl () {
      return window.CrustConfig.crm.baseUrl
    },
  },

  methods: {
    onSuccess (file, { response }) {
      this.$emit('uploaded', response)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/sass/_0.commons.scss';

div {
  .droparea {
    background-color: $appcream;
    font-size: 18px;
    text-align: center;
    padding: 10px;
    margin-bottom: 15px;
    cursor: pointer;

    &:hover {
      background-color: $appgrey;
    }
  }
}
</style>
