<template>
    <div class="flex flex-wrap">
      <b-button v-for="(b) in options.buttons"
                :key="b.triggerID"
                :variant="b.variant || 'primary'"
                class="flex-grow-1 mb-1"
                @click.prevent="runTriggers({ triggerID: b.triggerID, action: 'manual', module, record, namespace })">{{ b.label }}</b-button>
    </div>
</template>
<script>
import base from './base'
import triggerRunner from 'corteza-webapp-compose/src/mixins/trigger_runner'

export default {
  extends: base,

  mixins: [
    triggerRunner,
  ],

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
