<template>
  <div :class="blockClass">
    <div class="block-data">
      <h2>{{ block.title }}</h2>
      <p class="block-data-description" v-if="block.description">{{ block.description }}</p>
      <div class="block-data-content" v-if="blockComponentError">
        {{ blockComponentError.message }}
      </div>
      <div class="block-data-content" v-else>
        <component :is="block.kind"
                   :bounding-rect="boundingRect"
                   :options="block.options"
                   :page="page"
                   :module="module"
                   :record="record" />
      </div>
    </div>
  </div>
</template>

<script>
import * as ViewBlocks from './loader'

export default {
  props: {
    boundingRect: {
      type: Object,
      required: false,
    },

    block: {
      type: Object,
      required: true,
    },

    page: {
      type: Object,
      required: true,
    },

    module: {
      type: Object,
      required: false,
    },

    record: {
      type: Object,
      required: false,
    },
  },

  data () {
    return {
      blockComponentError: null,
    }
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

  errorCaptured (err) {
    this.blockComponentError = err
    return false
  },

  components: {
    ...ViewBlocks,
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/components/blocks.scss";

</style>
