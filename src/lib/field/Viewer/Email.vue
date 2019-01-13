<template>
  <span v-if="field.options.outputPlain">{{ value }}</span>
  <span v-else><a :href="'mailto:' + value" target="_blank">{{ value }}</a></span>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
