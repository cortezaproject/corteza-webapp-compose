<template>
  <div v-if="grid.length" class="builder-grid">
    <grid-layout :layout.sync="grid"
                 @layout-updated="handleLayoutUpdate"
                 :col-num="12"
                 :row-height="30"
                 :vertical-compact="true"
                 :is-resizable="!!editable"
                 :is-draggable="!!editable"
                 :use-css-transforms="true"
                 :responsive="true">
      <grid-item v-for="(item, index) in grid"
                 :key="item.i"
                 :x="item.x"
                 :y="item.y"
                 :w="item.w"
                 :h="item.h"
                 :i="item.i">
        <slot :block="item.block" :index="index"></slot>
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
      // all blocks in vue-grid friendly structure
      grid: blocksToGrid(this.blocks),
    }
  },

  watch: {
    blocks: {
      handler (blocks) {
        this.grid = blocksToGrid(blocks)
      },

      deep: true,
    },
  },

  methods: {
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
