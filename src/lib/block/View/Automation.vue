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
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import Module from 'corteza-webapp-compose/src/lib/module'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'

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
          namespace: new Namespace(this.namespace),
          module: new Module(this.module),
          record: new Record(this.module, this.record),
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
