<template>
  <div v-if="field.isMulti">
    <div v-for="(v, index) of value" :key="index">
      <span v-if="field.options.outputPlain">{{ value[index] }}</span>
      <span v-else @click.stop><a :href="'mailto:' + value" target="_blank">{{ value[index] }}</a></span>
    </div>
  </div>
  <div v-else>
    <span v-if="field.options.outputPlain">{{ value }}</span>
    <span v-else @click.stop><a :href="'mailto:' + value" target="_blank">{{ value }}</a></span>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
