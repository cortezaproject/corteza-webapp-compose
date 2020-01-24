<template>
    <div class="d-flex flex-wrap">
      <b-button v-for="(b, i) in options.buttons"
                :key="i"
                :variant="b.variant || 'primary'"
                class="m-1 flex-fill"
                @click.prevent="onAutomationButtonClick(b.script)">{{ b.label }}</b-button>
    </div>
</template>
<script>
import base from './base'
import triggerScript from 'corteza-webapp-compose/src/mixins/trigger-script'
import { compose } from '@cortezaproject/corteza-js'

export default {
  extends: base,

  mixins: [
    triggerScript,
  ],

  created () {
    const variants = ['primary', 'light', 'success', 'danger', 'secondary', 'warning', 'info', 'dark']
    this.options.buttons.map(b => {
      if (variants.indexOf(b.variant) < 0) {
        b.variant = 'primary'
      }
    })
  },

  methods: {
    onAutomationButtonClick (script) {
      console.debug('manually running script', script)

      this.TriggerManualScriptOnComposeRecord(
        { script },
        {
          namespace: new compose.Namespace(this.namespace),
          module: new compose.Module(this.module),
          record: new compose.Record(this.module, this.record),
        },
      ).then(record => {
        this.record.setValues(record.values)
      }).catch(({ message }) => {
        if (message) {
          this.raiseWarningAlert(message)
          console.error(message)
        }
      })
    },
  },
}
</script>
