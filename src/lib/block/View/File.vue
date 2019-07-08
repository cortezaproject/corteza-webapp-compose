<template>
  <list-loader kind="page"
               :set="options.attachments"
               :namespace="namespace"
               :mode="options.mode"></list-loader>
</template>
<script>
import base from './base'
import ListLoader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/ListLoader'

export default {
  components: {
    ListLoader,
  },

  extends: base,
}
</script>
