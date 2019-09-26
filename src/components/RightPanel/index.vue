<template>
  <sidebar position="right"
           name="right-panel"
           class="bg-white overflow-auto pb-5"
           :width="250"
           v-bind="$attrs">

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
}

</script>
