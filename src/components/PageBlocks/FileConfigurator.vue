<template>
  <b-tab :title="$t('block.file.label')">
    <b-form-group horizontal
                  :description="$t('field.kind.file.view.modeFootnote')"
                  :label="$t('field.kind.file.view.modeLabel')">
      <b-form-radio-group v-model="options.mode"
                          buttons
                          button-variant="outline-secondary"
                          size="sm"
                          name="buttons2"
                          :options="modes">
      </b-form-radio-group>
    </b-form-group>
    <b-form-checkbox
      :disabled="!enableFileNameHiding"
      v-model="options.hideFileName"
      class="mb-3"
    >
      {{ $t('field.kind.file.view.showName') }}
    </b-form-checkbox>
    <uploader
      :endpoint="endpoint"
      @uploaded="appendAttachment"
    />
    <list-loader kind="page"
                 enable-delete
                 :namespace="namespace"
                 :set.sync="options.attachments"
                 mode="list"
                 class="mt-2"></list-loader>
  </b-tab>
</template>
<script>
import base from './base'
import Uploader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/Uploader'
import ListLoader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/ListLoader'

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

      return this.$ComposeAPI.pageUploadEndpoint({
        namespaceID: this.namespace.namespaceID,
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

    enableFileNameHiding () {
      return (this.options.mode === 'single') || (this.options.mode === 'gallery')
    },
  },

  methods: {
    appendAttachment ({ attachmentID } = {}) {
      this.options.attachments.push(attachmentID)
    },
  },
}
</script>
