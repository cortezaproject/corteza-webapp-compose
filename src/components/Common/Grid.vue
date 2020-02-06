<template>
  <div
    v-if="grid.length"
    class="w-100 p-2 pb-5 mb-5 vh-100 overflow-auto flex-grow-1"
    :class="{ editable: !!editable }"
  >
    <grid-layout
      class="mb-5"
      @layout-updated="handleLayoutUpdate"
      :layout.sync="layout"
      :col-num="12"
      :row-height="50"
      :vertical-compact="true"
      :is-resizable="!!editable"
      :is-draggable="!!editable"
      :use-css-transforms="true"
      :cols="{ lg: 12, md: 12, sm: 1, xs: 1, xxs: 1 }"
      :margin="[0, 0]"
      :responsive="!editable"
    >
      <grid-item
        v-for="(item, index) in grid"
        :key="item.i"
        class="grid-item"
        ref="items"
        v-bind="{ ...item }"
      >
        <slot
          :block="blocks[item.i]"
          :index="index"
          :block-index="item.i"
          :bounding-rect="boundingRects[index]"
          v-on="$listeners"
        />
      </grid-item>
    </grid-layout>
  </div>
  <div
    v-else
    class="no-builder-grid pt-5 container text-center">
    <h4>{{ $t('page.noBlock') }}.</h4>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import { compose } from '@cortezaproject/corteza-js'
import { throttle } from 'lodash'

export default {
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },

  props: {
    editable: {
      type: Boolean,
    },

    blocks: {
      type: Array,
      required: true,
    },
  },

  data () {
    return {
      // all blocks in vue-grid friendly structure
      grid: [],

      // Grid items bounding rect info
      boundingRects: [],
    }
  },

  computed: {
    layout: {
      get () {
        return this.grid
      },

      set (layout) {
        this.grid = layout
        this.handleLayoutUpdate(layout)
      },
    },
  },

  watch: {
    blocks: {
      handler (blocks) {
        this.grid = blocks.map(({ xywh: [x, y, w, h] }, i) => ({ i, x, y, w, h }))
        this.recalculateBoundingRect()
      },
      immediate: true,
      deep: true,
    },
  },

  mounted () {
    window.addEventListener('resize', this.windowResizeThrottledHandler)
    this.recalculateBoundingRect()
  },

  destroyed () {
    window.removeEventListener('resize', this.windowResizeThrottledHandler)
  },

  methods: {
    windowResizeThrottledHandler: throttle(function () { this.recalculateBoundingRect() }, 500),

    // Fetch bounding boxes of all grid items
    recalculateBoundingRect () {
      this.boundingRects = (this.$refs.items || [])
        .map(({ $el }) => ({ ...$el.getBoundingClientRect() }))
    },

    handleLayoutUpdate (layout) {
      this.$emit('update:blocks', layout.map(
        ({ x, y, w, h, i }) => new compose.PageBlockMaker({ ...this.blocks[i], xywh: [x, y, w, h] }),
      ))
    },
  },
}
</script>
<style lang="scss">
.editable {
  .grid-item {
    background-image: linear-gradient(45deg, #f3f3f5 25%, #ffffff 25%, #ffffff 50%, #f3f3f5 50%, #f3f3f5 75%, #ffffff 75%, #ffffff 100%);
    background-size: 28.28px 28.28px;
  }
}
</style>
