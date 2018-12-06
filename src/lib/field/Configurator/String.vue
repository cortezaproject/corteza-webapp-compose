<template>
  <div>
    <div><b-form-checkbox v-model="f.options.multiLine">Multiline</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.useRichTextEditor">Use RTE</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
