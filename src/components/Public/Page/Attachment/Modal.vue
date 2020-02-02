<template>
  <c-preview-lightbox
    v-if="show"
    :src="(attachment || {}).document || (attachment || {}).src"
    :name="(attachment || {}).name"
    :alt="(attachment || {}).name"
    :labels="previewLabels"
    :meta="(attachment || {}).meta"
    @close="attachment=undefined">

    <p slot="header.left" class="m-0">
      {{ (attachment || {}).name }}
    </p>

    <a
      slot="header.right"
      v-if="attachment"
      :href="(attachment || {}).download">
      {{ $t('general.label.download') }}
    </a>
  </c-preview-lightbox>
</template>

<script>
import { components } from '@cortezaproject/corteza-vue'
const { CPreviewLightbox } = components

export default {
  components: {
    CPreviewLightbox,
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

    previewLabels () {
      return {
        loading: this.$t('preview.pdf.loading'),
        downloadForAll: this.$t('preview.pdf.downloadForAll'),
        pageLoadFailed: this.$t('preview.pdf.pageLoadFailed'),
        pageLoading: this.$t('preview.pdf.pageLoading'),
        noPages: this.$t('preview.pdf.noPages'),
        clickToRetry: this.$t('preview.pdf.clickToRetry'),
      }
    },
  },

  created () {
    window.addEventListener('keyup', this.onKeyUp)
    this.$root.$on('showAttachmentsModal', ({ url, download, name, document = undefined, meta }) => {
      this.attachment = {
        document,
        download,
        meta,
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
