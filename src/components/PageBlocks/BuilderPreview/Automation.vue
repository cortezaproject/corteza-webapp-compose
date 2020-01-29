<template>
  <div
    class="d-flex flex-wrap"
  >
    <b-button
      v-for="(b, i) in options.buttons"
      :key="i"
      :variant="b.variant || 'primary'"
      class="m-1 flex-fill"
    >
      {{ b.label }}
    </b-button>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,
}
</script>
