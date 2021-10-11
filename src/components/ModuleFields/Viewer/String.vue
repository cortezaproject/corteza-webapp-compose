<template>
  <div
    v-if="formatted"
    class="rt-content"
  >
    <div v-if="field.options.useRichTextEditor">
      <span v-html="formatted" />
    </div>
    <div
      v-else-if="field.options.multiLine"
      class="multiline"
    >
      {{ formatted }}
    </div>
    <div
      v-else
      :class="{'multiline': field.isMulti}"
    >
      {{ formatted }}
    </div>
    <errors :errors="errors" />
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>

<style>
.multiline {
  white-space: pre-line;
}
</style>
