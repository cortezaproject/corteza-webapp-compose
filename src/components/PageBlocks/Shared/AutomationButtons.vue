<template>
  <div>
    <b-button
      v-for="(b, i) in buttons"
      :key="i"
      :variant="variant(b)"
      :disabled="!isValid(b) || processing"
      :class="buttonClass"
      @click.prevent="handle(b)"
    >
      {{ b.label || '-' }}
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
    /**
     *
     */
    variant (b) {
      if (!b.script) {
        return b.variant
      }

      if (!this.isValid(b)) {
        // Does this script actually exist?
        return 'outline-danger'
      }

      return b.variant || 'primary'
    },

    isValid (b) {
      return !!b.script && !!this.$UIHooks.FindByScript(b.script)
    },

    handle (b) {
      if (!b.script) {
        return
      }

      this.processing = true

      // Base of the raise event:
      // we'll attach all extra arguments passed to component to
      // be part of the generated event
      let ev = { args: this.extraEventArgs || {} }

      // @todo page event missing
      switch (b.resourceType) {
        case 'compose:record':
          ev.args.namespace = this.namespace
          ev.args.module = this.module
          ev = compose.RecordEvent(this.record, ev)
          break
        case 'compose:module':
          ev.args.namespace = this.namespace
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

      // Passing events to eventbus
      //
      // The main reason to do this is because eventbus (or better, handlers registed there)
      // know how to handle each script - is it client or server script, what context to use
      // etc...
      this.$EventBus
        .Dispatch(ev, b.script)
        .catch(this.toastErrorHandler(this.$t('notification.automation.scriptFailed')))
        .finally(() => {
          this.processing = false
        })
    },
  },
}
</script>
