<template>
  <div class="view-grid" v-bind:class="{ 'mobile': !wide }">
    <grid-layout v-if="blocks.length > 0" :layout="blocks" :col-num="viewPageColNum" :row-height="90" :is-draggable="false" :is-resizable="false" :vertical-compact="true" :use-css-transforms="true">
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
  data () {
    return {
      wideWidth: 768,
      wide: false,
      window: {
        width: 0,
        height: 0,
      },
    }
  },
  created () {
    this.$store.dispatch('pages/initViewPageData', this.$route.params.id)
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  },
  destroyed () {
    window.removeEventListener('resize', this.handleResize)
  },
  computed: {
    ...mapState({
      viewPageDataError: state => state.pages.viewPageDataError,
      viewPageData: state => state.pages.viewPageData,
      viewPageColNum: state => state.pages.viewPageColNum,
    }),
    blocks () {
      if (this.wide) {
        return this.$store.state.pages.viewPageData.blocks
      } else {
        return this.$store.state.pages.viewPageData.mobileBlocks
      }
    },
  },
  methods: {
    ...mapActions('pages', []),
    handleResize () {
      this.window.width = window.innerWidth
      this.window.height = window.innerHeight
      if (this.window.width > this.wideWidth) {
        this.wide = true
        this.$store.commit('pages/setViewPageColNum', 2)
      } else {
        this.wide = false
        this.$store.commit('pages/setViewPageColNum', 1)
      }
    },
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
