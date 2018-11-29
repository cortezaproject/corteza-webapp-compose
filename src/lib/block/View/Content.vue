<template>
    <div v-html="options.body"></div>
</template>
<script>
import optionProp from './mixins/optionsProp.js'

export default {
  mixins: [
    optionProp,
  ],
}
</script>
