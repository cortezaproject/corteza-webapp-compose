<template>
  <div>
    <div><b-form-checkbox v-model="f.options.trimFragment">{{ $t('field.kind.url.label') }}</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.trimQuery">{{ $t('field.kind.url.trimHash') }}</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.trimPath">{{ $t('field.kind.url.trimQuestionMark') }}</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.onlySecure">{{ $t('field.kind.url.sshOnly') }}</b-form-checkbox></div>
    <div><b-form-checkbox v-model="f.options.outputPlain">{{ $t('field.kind.url.preventToLink') }}</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
