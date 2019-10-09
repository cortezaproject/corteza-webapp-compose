<template>
  <div v-if="grid.length" class="w-100 pb-5 vh-100 overflow-auto flex-grow-1">
    <grid-layout :layout.sync="grid"
                 @layout-updated="handleLayoutUpdate"
                 :col-num="12"
                 :row-height="rowHeight"
                 :vertical-compact="true"
                 :is-resizable="!!editable"
                 :is-draggable="!!editable"
                 :use-css-transforms="true"
                 :cols="cols"
                 :margin="[20, 20]"
                 class="mb-5"
                 :responsive="true">
      <grid-item v-for="(item, index) in grid"
                 :key="item.i"
                 class="shadow rounded-lg"
                 ref="items"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i">
        <slot :block="blocks[item.i]"
              :index="index"
              v-on="$listeners"
              :bounding-rect="boundingRects[index]"></slot>
      </grid-item>
    </grid-layout>
  </div>
  <div v-else class="no-builder-grid pt-5 container text-center">
    <h4>{{ $t('page.noBlock') }}.</h4>
  </div>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import Block from 'corteza-webapp-compose/src/lib/block'
import _ from 'lodash'

const blocksToGrid = blocks => {
  return blocks.map(({ xywh: [ x, y, w, h ] }, i) => {
    return {
      i,

      x,
      y,
      w,
      h,
    }
  })
}

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
      rowHeight: 30,

      // all blocks in vue-grid friendly structure
      grid: [],

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
    windowResizeThrottledHandler: _.throttle(function () { this.recalculateBoundingRect() }, 500),

    // Fetch bounding boxes of all grid items
    recalculateBoundingRect () {
      this.boundingRects = (this.$refs.items || []).map(({ $el }) => {
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
      this.$emit('update:blocks', grid.map(
        ({ x, y, w, h, i }) => new Block({ ...this.blocks[i], xywh: [ x, y, w, h ] })
      ))
    },
  },
}
</script>
