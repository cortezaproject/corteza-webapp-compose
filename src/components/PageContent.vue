<template>
  <div class="view-grid">
    <grid-layout v-if="internalLayout && internalLayout.length > 0"
      :layout.sync="internalLayout"
      :col-num="colNum"
      :row-height="90"
      :is-draggable="false"
      :is-resizable="false"
      :vertical-compact="true"
      :use-css-transforms="true"
      :responsive="responsive"
      :breakpoints="gridBreakPoints"
      :cols="gridColSizes">
      <grid-item v-for="block in internalLayout" v-bind:key="block.i" :x="block.x" :y="block.y" :w="block.w" :h="block.h" :i="block.i" v-bind:is-draggable="false">
        <Block :block="block"></Block>
      </grid-item>
    </grid-layout>
    <div style="color:red;" v-if="!internalLayout || internalLayout.length == 0">
      This page has no blocks
    </div>
  </div>
</template>

<script>
/* eslint-disable-next-line */
import VueGridLayout from 'vue-grid-layout'
import Block from '@/components/block/Block'
export default {
  name: 'PageContent',
  components: {
    Block,
  },
  props: {
    layout: Array,
  },
  data () {
    return {
      window: {
        width: 0,
        height: 0,
      },
      colNum: 12,
      blocks: null,
      gridBreakPoints: {
        lg: 1200,
        md: 996,
        sm: 768,
        xs: 480,
        xxs: 0,
      },
      gridColSizes: {
        lg: 12,
        md: 10,
        sm: 6,
        xs: 4,
        xxs: 2,
      },
      responsive: true,
      internalLayout: [],
    }
  },
  created () {
    this.internalLayout = this.layout
  },
  watch: {
    layout: {
      handler: function () {
        this.internalLayout = this.layout
      },
      deep: true,
    },
  },
}
</script>
