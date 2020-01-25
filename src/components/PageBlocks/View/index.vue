<template>
  <b-card
    class="h-100 border-0 overflow-auto"
    :class="blockClass"
    :header="block.title"
    :sub-title="block.description"
    header-class="sticky-top h5"
    :header-bg-variant="block.style.variants.headerBg"
    :header-text-variant="block.style.variants.headerText"
    :header-border-variant="block.style.variants.border"
    :body-bg-variant="block.style.variants.bodyBg">
    <div v-if="blockComponentError">
      {{ blockComponentError.message }}
    </div>
    <div class="h-100" ref="content" v-else>
      <component :is="block.kind"
                 :bounding-rect="adjustedBoundingRect"
                 v-bind="$props"
                 v-on="$listeners" />
    </div>
  </b-card>
</template>
<script>
import * as ViewBlocks from './loader'
import { compose } from '@cortezaproject/corteza-js'

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
      type: compose.Namespace,
      required: true,
    },

    page: {
      type: compose.Page,
      required: true,
    },

    block: {
      type: compose.PageBlock,
      required: true,
    },

    module: {
      type: compose.Module,
      required: false,
    },

    record: {
      type: compose.Record,
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
      return [
        'block',
        this.block.kind,
      ]
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
    // Capture and output error into the block
    // + log it to console so we do not lost the details
    /* eslint-disable no-console */
    console.error(err)
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
