<template>
  <div>
    <div><b-form-checkbox plain v-model="f.options.multiLine">{{ $t('field.kind.string.multiLine') }}</b-form-checkbox></div>
    <div><b-form-checkbox plain v-model="f.options.useRichTextEditor">{{ $t('field.kind.string.richText') }}</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
