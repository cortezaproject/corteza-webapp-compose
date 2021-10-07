<template>
  <wrap
    v-bind="$props"
    v-on="$listeners"
  >
    <div
      v-if="loading"
      class="h-100 d-flex align-items-center justify-content-center"
    >
      <b-spinner />
    </div>

    <automation-buttons
      v-else
      class="d-flex flex-wrap"
      button-class="my-1 mx-3 flex-fill"
      :buttons="options.buttons"
      :automation-scripts="automationScripts"
      v-bind="$props"
    />
  </wrap>
</template>
<script>
import base from './base'
import AutomationButtons from './Shared/AutomationButtons'

export default {
  components: { AutomationButtons },
  extends: base,

  props: {
    extraEventArgs: {
      type: Object,
      default: () => ({}),
    },
  },

  data () {
    return {
      automationScripts: [],
      loading: true,
    }
  },

  computed: {
    hasUIHooks () {
      return this.$UIHooks.set && !!this.$UIHooks.set.length
    },
  },

  async created () {
    if (this.$UIHooks.set && !!this.$UIHooks.set.length) {
      this.loading = false
      return
    }

    const { set } = await this.$ComposeAPI.automationList({ eventTypes: ['onManual'], excludeInvalid: true })
    this.automationScripts = set
    this.loading = false
  },

}
</script>
