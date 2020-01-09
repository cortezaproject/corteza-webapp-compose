<template>
  <div class="d-flex flex-wrap">
    <b-button v-for="(b) in options.buttons"
              :key="b.scriptID || b.triggerID"
              :variant="b.variant || 'primary'"
              class="m-1 flex-fill"
              disabled
    >{{ b.label }}
     </b-button>
  </div>
</template>
<script>
import base from './base'

export default {
  extends: base,

  created () {
    const variants = ['primary', 'light', 'success', 'danger', 'secondary', 'warning', 'info', 'dark']
    this.options.buttons.map(b => {
      if (variants.indexOf(b.variant) < 0) {
        b.variant = 'primary'
      }
    })
  },
}
</script>
