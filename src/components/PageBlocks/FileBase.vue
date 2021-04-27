<template>
  <wrap
    v-bind="$props"
    v-on="$listeners"
  >
    <div
      class="p-2"
    >
      <list-loader
        kind="page"
        :set="options.attachments"
        :namespace="namespace"
        :mode="options.mode"
        :hide-file-name="options.hideFileName"
      />
    </div>
  </wrap>
</template>
<script>
import base from './base'
import ListLoader from '../Public/Page/Attachment/ListLoader'

export default {
  components: {
    ListLoader,
  },

  extends: base,
}
</script>
