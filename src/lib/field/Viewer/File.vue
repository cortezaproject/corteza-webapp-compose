<template>
  <list-loader kind="record"
               :set="[value]"
               :mode="field.options.mode"></list-loader>
</template>
<script>
import base from './base'
import ListLoader from '@/components/Public/Page/Attachment/ListLoader'

export default {
  extends: base,

  components: {
    ListLoader,
  },
}
</script>
