<template>
  <div>
    <div v-if="field.options.useRichTextEditor"><span v-html="formatted"></span></div>
    <div v-if="fiel.options.multiLine" class="note">{{ formatted }}</div>
    <div v-if="!fiel.options.multiLine && !field.options.useRichTextEditor">{{ formatted }}</div>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>

<style>
.note {
  white-space: pre-line;
}
</style>
