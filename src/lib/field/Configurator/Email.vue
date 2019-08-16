<template>
  <div>
    <div><b-form-checkbox v-model="f.options.outputPlain">{{ $t('field.kind.email.preventToLink') }}</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
