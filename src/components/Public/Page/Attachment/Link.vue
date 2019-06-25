<template>
  <a v-if="canPreview"
     @click.exact.prevent="openLightbox({ ...attachment, ...$event })"
     :href="attachment.download"><slot>{{ attachment.name }}</slot></a>
  <a v-else
     :href="attachment.download"><slot>{{ attachment.name }}</slot></a>
</template>
<script>
import { canPreview } from 'corteza-webapp-common/src/lib/file_preview'

export default {
  props: {
    attachment: {
      type: Object,
      required: true,
    },
  },

  computed: {
    canPreview () {
      return (a) => {
        const meta = a.meta || {}
        const type = (meta.preview || meta.original || {}).mimetype
        const src = (a.meta.original && a.meta.original.ext === 'pdf' ? a.download : a.previewUrl)
        return canPreview({ type, src, name: a.name })
      }
    },
  },

  methods: {
    openLightbox (e) {
      this.$root.$emit('showAttachmentsModal', e)
    },
  },
}
</script>
