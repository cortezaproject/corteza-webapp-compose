<template>
  <div class="flex flex-wrap">
    <b-button v-for="(b) in options.buttons"
              :key="b.triggerID"
              :variant="b.variant || 'primary'"
              class="flex-grow-1 mb-1"
              disabled
    >{{ b.label }}
     </b-button>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
