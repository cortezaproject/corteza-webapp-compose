<template>
  <div class="d-flex flex-column w-100 vh-100 overflow-auto">
    <main class="w-100 flex-grow">
      <router-view />
    </main>
    <c-prompts />
  </div>
</template>
<script>
import { components } from '@cortezaproject/corteza-vue'

export default {
  components: {
    CPrompts: components.CPrompts,
  },

  data () {
    return {
      alerts: [], // { variant: 'info', message: 'foo' },
    }
  },

  beforeDestroy () {
    this.$root.$off('alert')
  },
}
</script>
