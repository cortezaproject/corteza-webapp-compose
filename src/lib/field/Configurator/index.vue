<template>
  <div>
    {{ field }}
    <component
      v-if="hasConfigurator"
      :is="configurator" :options.sync="field.options" />
  </div>
</template>

<script>
import * as Configurators from './loader'

export default {
  props: {
    field: {
      type: Object,
      required: true,
    },
  },

  computed: {
    hasConfigurator () {
      if (!this.field || !this.configurator) {
        return false
      }

      const kind = this.configurator.toLocaleLowerCase()
      return Object.keys(this.$options.components).map(c => c.toLocaleLowerCase()).findIndex(c => c === kind) >= 0
    },

    configurator () {
      return this.field.kind
    },
  },

  components: {
    ...Configurators,
  },
}
</script>
