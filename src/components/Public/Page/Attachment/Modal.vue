<template>
  <preview-lightbox
    v-if="show"
    :src="(attachment || {}).pdf || (attachment || {}).src"
    :name="(attachment || {}).name"
    :alt="(attachment || {}).name"
    @close="attachment=undefined">

    <p slot="header.left" class="m-0">
      {{ (attachment || {}).name }}
    </p>

    <a
      slot="header.right"
      :href="(attachment || {}).download">

      {{ $t('general.label.download') }}
    </a>
  </preview-lightbox>
</template>

<script>
import { PreviewLightbox } from 'corteza-webapp-common/src/components/FilePreview/index'

export default {
  components: {
    PreviewLightbox,
  },

  data () {
    return {
      attachment: undefined,
    }
  },

  computed: {
    show: {
      get () {
        return !!this.attachment
      },

      set (show) {
        if (!show) {
          this.attachment = undefined
        }
      },
    },
  },

  created () {
    window.addEventListener('keyup', this.onKeyUp)
    this.$root.$on('showAttachmentsModal', ({ url, download, name, pdf = undefined }) => {
      this.attachment = {
        pdf,
        download,
        src: url,
        name: name,
        caption: name,
      }
    })
  },

  beforeDestroy () {
    window.removeEventListener('keyup', this.onKeyUp)
    this.$root.$off('showAttachmentsModal')
  },

  methods: {
    onKeyUp ({ key }) {
      if (key === 'Escape') {
        this.attachment = undefined
      }
    },
  },
}
</script>
<style lang="scss" scoped>
  img {
    max-width: 100%;
  }

</style>
