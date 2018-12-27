<template>
  <div>
    <div><b-form-checkbox plain v-model="f.options.presetWithAuthenticated">Preset with current user</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
