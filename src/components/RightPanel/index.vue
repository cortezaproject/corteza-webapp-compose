<template>
  <c-reminder-sidebar
    position="right"
    name="right-panel"
    class="bg-white overflow-auto pb-5 border-left"
    :width="250"
    v-bind="$attrs"
    :visible.sync="visible"
  >
    <reminder
      v-bind="$props"
    />
  </c-reminder-sidebar>
</template>

<script>
import Reminder from './reminder'
import { components } from '@cortezaproject/corteza-vue'
const { CReminderSidebar } = components

export default {
  components: {
    Reminder,
    CReminderSidebar,
  },
  inheritAttrs: false,

  props: {
    namespaceID: {
      type: String,
      required: true,
    },
  },

  data () {
    return {
      visible: false,
    }
  },

  mounted () {
    this.$root.$on('rightPanel.toggle', this.setState)
  },

  beforeDestroy () {
    this.$root.$off('rightPanel.toggle', this.setState)
  },

  methods: {
    setState (s) {
      this.visible = s
    },
  },
}

</script>
<style lang="scss" scoped>
aside {
  z-index: 1;
}
</style>
