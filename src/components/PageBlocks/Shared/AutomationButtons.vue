<template>
  <div>
    <b-button
      v-for="(b, i) in buttons"
      :key="i"
      :variant="b.variant || 'primary'"
      :disabled="processing"
      :class="buttonClass"
      @click.prevent="handle(b)"
    >
      {{ b.label }}
    </b-button>
  </div>
</template>
<script>
import { compose } from '@cortezaproject/corteza-js'
import base from '../base'

export default {
  extends: base,

  props: {
    buttons: {
      type: Array,
      required: true,
    },

    buttonClass: {
      type: String,
      default: '',
    },

    extraEventArgs: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      processing: false,
    }
  },

  methods: {
    handle (b) {
      this.processing = true

      // Base of the raise event:
      // we'll attach all extra arguments passed to component to
      // be part of the generated event
      let ev = { args: this.extraEventArgs }

      // @todo page event missing
      switch (b.resourceType) {
        case 'compose:record':
          ev = compose.RecordEvent(this.record, ev)
          break
        case 'compose:module':
          ev = compose.ModuleEvent(this.module, ev)
          break
        case 'compose:namespace':
          ev = compose.NamespaceEvent(this.namespace, ev)
          break
        case 'compose':
          ev = compose.ComposeEvent(ev)
      }

      // @todo this is not a complete implementation
      //       we need to do a proper filtering via constraint matching
      //       for now, all (configured) buttons are displayed

      this.$EventBus
        .Dispatch(ev, b.script)
        .catch(this.defaultErrorHandler(this.$t('notification.automation.scriptFailed')))
        .finally(() => {
          this.processing = false
        })
    },
  },
}
</script>
