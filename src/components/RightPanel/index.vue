<template>
  <sidebar position="right"
           name="right-panel"
           class="bg-white overflow-auto pb-5"
           :width="250"
           v-bind="$attrs"
           :visible.sync="visible">

    <reminder v-bind="$props" />
  </sidebar>
</template>

<script>
import Reminder from './reminder'
import Sidebar from 'corteza-webapp-common/src/components/Sidebar'

export default {
  components: {
    Reminder,
    Sidebar,
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

  methods: {
    setState (s) {
      this.visible = s
    },
  },
}

</script>
