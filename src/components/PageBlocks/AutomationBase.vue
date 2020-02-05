<template>
  <wrap v-bind="$props" v-on="$listeners">
    <template>
      <div
        class="d-flex flex-wrap"
      >
        <b-button
          v-for="(b, i) in options.buttons"
          :key="i"
          :variant="b.variant || 'primary'"
          :disabled="processing"
          class="m-1 flex-fill"
          @click.prevent="handle(b)"
        >
          {{ b.label }}
        </b-button>
      </div>
    </template>
  </wrap>
</template>
<script>
import base from './base'
import { compose } from '@cortezaproject/corteza-js'

export default {
  extends: base,

  data () {
    return {
      processing: false,
    }
  },

  methods: {
    handle (b) {
      this.processing = true
      let ev

      switch (b.resourceType) {
        case 'compose:record':
          ev = compose.RecordEvent(this.record)
          break
        case 'compose:module':
          ev = compose.ModuleEvent(this.module)
          break
        case 'compose:namespace':
          ev = compose.NamespaceEvent(this.namespace)
          break
        case 'compose':
          ev = compose.ComposeEvent()
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
