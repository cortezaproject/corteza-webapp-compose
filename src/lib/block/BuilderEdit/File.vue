<template>
  <div>
    <b-form-group horizontal
                  :description="$t('field.kind.file.view.modePlaceholder')"
                  :label="$t('field.kind.file.view.modeLabel')">
      <b-form-radio-group v-model="options.mode"
                          buttons
                          button-variant="outline-secondary"
                          size="sm"
                          name="buttons2"
                          :options="modes">
      </b-form-radio-group>
    </b-form-group>
   <uploader :endpoint="endpoint" @uploaded="appendAttachment" />
    <list-loader kind="page"
                 enable-delete
                 :namespace="namespace"
                 :set.sync="options.attachments"
                 mode="list"></list-loader>
  </div>
</template>
<script>
import base from './base'
import Uploader from '@/components/Public/Page/Attachment/Uploader'
import ListLoader from '@/components/Public/Page/Attachment/ListLoader'

export default {
  name: 'File',

  components: {
    Uploader,
    ListLoader,
  },

  extends: base,

  computed: {
    endpoint () {
      const { pageID } = this.page

      return this.$compose.pageUploadEndpoint({
        namespacIDe: this.namespace.namespaceID,
        pageID,
      })
    },

    modes () {
      return [
        { value: 'list', text: this.$t('field.kind.file.view.list') },
        { value: 'grid', text: this.$t('field.kind.file.view.grid') },
        { value: 'single', text: this.$t('field.kind.file.view.single') },
        { value: 'gallery', text: this.$t('field.kind.file.view.gallery') },
      ]
    },
  },

  methods: {
    appendAttachment ({ attachmentID } = {}) {
      this.options.attachments.push(attachmentID)
    },
  },
}
</script>
