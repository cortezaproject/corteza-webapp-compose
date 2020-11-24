<template>
  <b-form-group
    :label="label"
    label-class="text-secondary"
    :class="formGroupStyleClasses"
  >
    <uploader :endpoint="endpoint"
              @uploaded="appendAttachment"
              :acceptedFiles="$s('compose.Page.Attachments.Mimetypes', ['*/*'])"
              :maxFilesize="$s('compose.Page.Attachments.MaxSize', 100)"/>

    <list-loader kind="record"
                 :set.sync="set"
                 :namespace="namespace"
                 :enable-order="field.isMulti"
                 enable-delete
                 mode="list"
                 class="mt-2"></list-loader>
    <errors :errors="errors" />
  </b-form-group>
</template>
<script>
import base from './base'
import Uploader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/Uploader'
import ListLoader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/ListLoader'

export default {
  components: {
    Uploader,
    ListLoader,
  },

  extends: base,

  computed: {
    endpoint () {
      const { moduleID, recordID } = this.record
      const { namespaceID } = this.namespace

      return this.$ComposeAPI.recordUploadEndpoint({
        namespaceID,
        moduleID,
        recordID,
        fieldName: this.field.name,
      })
    },

    set: {
      get () {
        return this.field.isMulti ? this.value : [this.value]
      },

      set (v) {
        if (this.field.isMulti) {
          this.value = v
        } else {
          this.value = (Array.isArray(v) && v.length > 0) ? v[0] : undefined
        }
      },
    },
  },

  methods: {
    appendAttachment ({ attachmentID } = {}) {
      if (this.field.isMulti) {
        this.value.push(attachmentID)
      } else {
        this.value = attachmentID
      }
    },
  },
}
</script>
