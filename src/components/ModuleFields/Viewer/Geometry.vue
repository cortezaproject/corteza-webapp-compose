<template>
  <div
    v-if="formatted"
  >
    <p>
      {{ coordinates[0] }}, {{ coordinates[1] }}
    </p>

    <errors :errors="errors" />
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,

  computed: {
    formatted () {
      return JSON.parse(this.value || '{}')
    },

    coordinates () {
      return this.formatted.coordinates || ['0', '0']
    },
  },
}
</script>

<style>
.multiline {
  white-space: pre-line;
}
</style>
