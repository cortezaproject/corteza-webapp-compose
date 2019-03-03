<template>
  <b-form-group :label="field.label || field.name">
    <uploader :endpoint="endpoint" @uploaded="appendAttachment" />
    <list-loader kind="record"
                 :set.sync="set"
                 enable-delete
                 mode="list"></list-loader>
  </b-form-group>
</template>
<script>
import base from './base'
import Uploader from '@/components/Public/Page/Attachment/Uploader'
import ListLoader from '@/components/Public/Page/Attachment/ListLoader'

export default {
  components: {
    Uploader,
    ListLoader,
  },

  extends: base,

  computed: {
    endpoint () {
      const { moduleID, recordID } = this.record
      const { name } = this.field
      return `/module/${moduleID}/record/${recordID}/${name}/attachment`
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
    appendAttachment ({ attachmentID }) {
      if (this.field.isMulti) {
        this.value.push(attachmentID)
      } else {
        this.value = attachmentID
      }
    },
  },
}
</script>
