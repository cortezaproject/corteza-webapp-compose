<template>
  <wrap v-bind="$props" v-on="$listeners">
    <div class="rt-content">
      <div v-html="options.body"></div>
    </div>
  </wrap>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
