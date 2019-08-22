<template>
    <div class="d-flex flex-wrap">
      <b-button v-for="(b) in options.buttons"
                :key="b.scriptID || b.triggerID"
                :variant="b.variant || 'primary'"
                class="m-1 flex-fill"
                @click.prevent="onAutomationButtonClick(b.scriptID || b.triggerID)">{{ b.label }}</b-button>
    </div>
</template>
<script>
import base from './base'
import uiScriptRunner from 'corteza-webapp-compose/src/mixins/ui-script-runner'
import Record from 'corteza-webapp-common/src/lib/types/compose/record'
import Module from 'corteza-webapp-compose/src/lib/module'
import Namespace from 'corteza-webapp-common/src/lib/types/compose/namespace'

export default {
  extends: base,

  mixins: [
    uiScriptRunner,
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
    onAutomationButtonClick (scriptID) {
      console.debug('manually running script', scriptID)

      this.runScripByID(scriptID, {
        namespace: new Namespace(this.namespace),
        module: new Module(this.module),
        record: new Record(this.module, this.record),
      }).then((rval) => {
        if (rval instanceof Record) {
          // This applies changes to the record.
          //
          // This is done because references work as we want them
          this.record.setValues(rval.values)
        }
      }).catch(({ message }) => {
        if (message) {
          this.raiseWarningAlert(message)
        }
      })
    },
  },
}
</script>
