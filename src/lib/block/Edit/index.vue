<template>
  <div :class="blockClass">
    <h2>{{ block.title }}</h2>
    <p v-if="block.description">{{ block.description }}</p>
    <div>
      <component :is="block.kind"
                 :options="block.options"
                 v-bind="$props"
                 v-on="$listeners" />
    </div>
  </div>
</template>

<script>
import * as ViewBlocks from './loader'

export default {
  components: {
    ...ViewBlocks,
  },

  props: {
    block: {
      type: Object,
      required: true,
    },

    namespace: {
      type: Object,
      required: true,
    },

    page: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: true,
    },

    record: {
      type: Object,
      required: false,
    },
  },

  computed: {
    blockClass () {
      let c = ['block', this.block.kind]

      if (this.block.theme) {
        c.push('theme-' + this.block.theme)
      }

      return c
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/components/blocks.scss";
</style>
