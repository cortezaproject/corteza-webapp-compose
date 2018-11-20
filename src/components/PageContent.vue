<template>
  <div class="view-grid">
    <grid-layout v-if="layout && layout.length > 0" :layout.sync="layout" :col-num="colNum" :row-height="90" :is-draggable="false" :is-resizable="false" :vertical-compact="true" :use-css-transforms="true" :responsive="responsive">
      <grid-item v-for="block in layout" v-bind:key="block.i" :x="block.x" :y="block.y" :w="block.w" :h="block.h" :i="block.i" v-bind:is-draggable="false">
        <Block :block="block"></Block>
      </grid-item>
    </grid-layout>
    <div style="color:red;" v-if="!layout || layout.length == 0">
      This page has no blocks
    </div>
  </div>
</template>

<script>
/* eslint-disable-next-line */
import VueGridLayout from "vue-grid-layout";
import Block from '@/components/block/Block'
export default {
  name: 'PageContent',
  components: {
    Block,
  },
  props: {
    layout: [],
  },
  data () {
    return {
      window: {
        width: 0,
        height: 0,
      },
      colNum: 12,
      blocks: null,
    }
  },
}
</script>
