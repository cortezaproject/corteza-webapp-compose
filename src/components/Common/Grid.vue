<template>
  <div v-if="grid.length" class="builder-grid">
    <grid-layout :layout.sync="grid"
                 @layout-updated="handleLayoutUpdate"
                 :col-num="12"
                 :row-height="rowHeight"
                 :vertical-compact="true"
                 :is-resizable="!!editable"
                 :is-draggable="!!editable"
                 :use-css-transforms="true"
                 :cols="cols"
                 :responsive="true">
      <grid-item v-for="(item, index) in grid"
                 :key="item.i"
                 ref="items"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i">
        <slot :block="item.block"
              :index="index"
              :bounding-rect="boundingRects[index]"></slot>
      </grid-item>
    </grid-layout>
  </div>
  <div v-else class="no-builder-grid container well text-center">
    <h4>No block added yet.</h4>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import Block from '@/lib/block'
import _ from 'lodash'

const blocksToGrid = blocks => {
  return blocks.map((block, i) => {
    return {
      i,

      x: block.x,
      y: block.y,
      w: block.width,
      h: block.height,

      block,
    }
  })
}

export default {
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
      rowHeight: 30,

      // all blocks in vue-grid friendly structure
      grid: blocksToGrid(this.blocks),

      // attempt to solve responsive grid issues. 2 views: desktop and mobile
      cols: { lg: 12, md: 12, sm: 1, xs: 1, xxs: 1 },

      // Grid items bounding rect info
      boundingRects: [],
    }
  },

  watch: {
    blocks: {
      handler (blocks) {
        this.grid = blocksToGrid(blocks)
        this.recalculateBoundingRect()
      },

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
    windowResizeThrottledHandler: _.throttle(function () { this.recalculateBoundingRect() }, 500),

    // Fetch bounding boxes of all grid items
    recalculateBoundingRect () {
      this.boundingRects = this.$refs.items.map(({ $el }) => {
        const bcr = $el.getBoundingClientRect()
        return {
          width: bcr.width,
          height: bcr.height,
          top: bcr.top,
          left: bcr.left,
          right: bcr.right,
          bottom: bcr.bottom,
        }
      })
    },

    handleLayoutUpdate (grid) {
      // Emit change back with 'update:' prefix for .sync modifier to kick in.
      this.$emit(
        'update:blocks',
        grid.map(({ x, y, w, h, block }) => {
          const b = new Block(block)
          b.merge({ x, y, width: w, height: h })
          return b
        })
      )
    },
  },

  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
  },
}
</script>

<style lang="scss" scoped>
.builder-grid {
  width: 100%;
  padding: 0 10px 70px;

  &.mobile {
    width: 320px;
    margin: 0 auto;
  }
}

</style>
