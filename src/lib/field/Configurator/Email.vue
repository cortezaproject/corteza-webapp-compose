<template>
  <div>
    <div><b-form-checkbox plain v-model="f.options.outputPlain">Don't turn email into a link</b-form-checkbox></div>
  </div>
</template>

<script>
import base from './base'

export default {
  extends: base,
}
</script>
