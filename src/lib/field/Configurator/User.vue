<template>
  <div>
    <div><b-form-checkbox plain v-model="f.options.presetWithAuthenticated">{{ $t('field.kind.user.presetWithCurrentUser') }}</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
