<template>
  <div :class="blockClass">
    <h2>{{ block.title }}</h2>
    <p v-if="block.description">{{ block.description }}</p>
    <div v-if="blockComponentError">
      {{ blockComponentError.message }}
    </div>
    <div ref="content" v-else>
      <component :is="block.kind"
                 :bounding-rect="adjustedBoundingRect"
                 :options="block.options"
                 :namespace="namespace"
                 :page="page"
                 :module="module"
                 :record="record"
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
    boundingRect: {
      type: Object,
      required: false,
    },

    namespace: {
      type: Object,
      required: true,
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
      adjustedBoundingRect: {},
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

  watch: {
    boundingRect () {
      // Bounding rect changes on every resize
      // we need to pick up new dimensions and update adjusted boundingRect
      this.recalculateBlockRect()
    },
  },

  mounted () {
    this.recalculateBlockRect()
  },

  errorCaptured (err) {
    this.blockComponentError = err
    return false
  },

  methods: {
    recalculateBlockRect () {
      const bcr = this.$refs.content.getBoundingClientRect()
      this.adjustedBoundingRect = {
        width: bcr.width,
        height: bcr.height,
        top: bcr.top,
        left: bcr.left,
        right: bcr.right,
        bottom: bcr.bottom,
      }
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/sass/components/blocks.scss";

</style>
