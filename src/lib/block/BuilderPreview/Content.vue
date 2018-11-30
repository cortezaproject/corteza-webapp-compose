<template>
    <div v-html="options.body"></div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'

export default {
  mixins: [
    optionsPropMixin,
  ],
}
</script>
