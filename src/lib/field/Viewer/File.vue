<template>
  <list-loader kind="record"
               :set="[value]"
               :namespace="namespace"
               :mode="field.options.mode"></list-loader>
</template>
<script>
import base from './base'
import ListLoader from '@/components/Public/Page/Attachment/ListLoader'

export default {
  components: {
    ListLoader,
  },

  extends: base,
}
</script>
