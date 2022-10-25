<template>
  <div
    @click.stop
  >
    <list-loader
      kind="record"
      :set="set"
      :namespace="namespace"
      :mode="field.options.mode"
      :hide-file-name="field.options.hideFileName"
      :height="options.height"
      :width="options.width"
      :max-height="options.maxHeight"
      :max-width="options.maxWidth"
      :border-radius="options.borderRadius"
      :background-color="options.backgroundColor"
      :margin="options.margin"
    />

    <errors :errors="errors" />
  </div>
</template>
<script>
import base from './base'
import ListLoader from 'corteza-webapp-compose/src/components/Public/Page/Attachment/ListLoader'

export default {
  components: {
    ListLoader,
  },

  extends: base,

  computed: {
    set () {
      return this.field.isMulti ? this.value : [this.value]
    },
  },
}
</script>
