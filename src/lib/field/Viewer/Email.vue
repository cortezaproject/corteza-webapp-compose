<template>
  <div class="form-group">

    <span v-if="field.options.outputPlain">{{ value }}</span>
    <span v-else><a :href="'mailto:' + value" target="_blank">{{ value }}</a></span>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
