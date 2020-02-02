<template>
  <div>
    <b-button v-for="(b) in options.buttons"
              :key="b.triggerID"
              variant="dark"
              class="mb-1"
              disabled>{{ b.label }}
     </b-button>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
