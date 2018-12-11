<template>
  <div>
    <div v-if="field.options.useRichTextEditor"><span v-html="formatted"></span></div>
    <div v-else>{{ formatted }}</div>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
