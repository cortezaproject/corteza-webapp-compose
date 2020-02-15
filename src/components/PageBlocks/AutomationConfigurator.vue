<template>
  <automation-tab
    :resources="resources"
    :buttons.sync="options.buttons"
  />
</template>
<script>
import base from './base'
import AutomationTab from './Shared/AutomationTab'

export default {
  name: 'Automation',

  components: {
    AutomationTab,
  },

  extends: base,

  computed: {
    resources () {
      const set = [
        'compose',
        'compose:namespace',
        'compose:page',
      ]

      if (this.module) {
        set.push(
          'compose:module',
          'compose:record',
        )
      }

      return set
    },
  },
}
</script>
