<template>
  <div class="view-grid" v-bind:class="{ 'mobile': false }">
    <grid-layout v-if="blocks.length > 0" :layout="blocks" :col-num="colNum" :row-height="90" :is-draggable="false" :is-resizable="false" :vertical-compact="true" :use-css-transforms="true">
      <grid-item v-for="block in blocks" v-bind:key="block.i" :x="block.x" :y="block.y" :w="block.w" :h="block.h" :i="block.i" v-bind:is-draggable="false">
        <Block :block="block"></Block>
      </grid-item>
    </grid-layout>
    <div v-if="viewPageDataError" style="color:red">
      {{ viewPageDataError }}
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
/* eslint-disable-next-line */
import VueGridLayout from "vue-grid-layout";
import Block from '@/components/block/Block'
export default {
  name: 'PageView',
  components: {
    Block,
  },
  created () {
    this.$store.dispatch('pages/initViewPageData', this.$route.params.id)
  },
  computed: {
    ...mapState({
      blocks: state => state.pages.viewPageData.blocks,
      viewPageDataError: state => state.pages.viewPageDataError,
      viewPageData: state => state.pages.viewPageData,
      colNum: state => state.pages.viewPageColNum,
    }),
  },
  methods: {
    ...mapActions('pages', []),
  },
}
</script>
<style lang="scss" scoped>
@import "src/assets/styles/shared";

.view-grid {
  width: 100%;
  &.mobile {
    width: 320px;
    margin: 0 auto;
  }
  .vue-grid-item {
    border: 1px solid #ccc;
    padding: 10px;
  }
}
</style>
