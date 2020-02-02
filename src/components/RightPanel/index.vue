<template>
  <c-sidebar position="right"
           name="right-panel"
           class="bg-white overflow-auto pb-5"
           :width="250"
           v-bind="$attrs"
           :visible.sync="visible">

    <reminder v-bind="$props" />
  </c-sidebar>
</template>

<script>
import Reminder from './reminder'
import { components } from '@cortezaproject/corteza-vue'
const { CSidebar } = components

export default {
  components: {
    Reminder,
    CSidebar,
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
