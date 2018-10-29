<template>
  <div v-if="layout.length >= 1" v-bind:class="{ 'mobile': mobilePreview }" class="builder-grid">
    <grid-layout :layout="layout" :col-num="colNum" :row-height="90" :is-draggable="draggable" :is-resizable="resizable" :vertical-compact="true" :use-css-transforms="true">
      <grid-item v-for="block in layout" v-bind:key="block.i" :x="block.x" :y="block.y" :w="block.w" :h="block.h" :i="block.i" v-bind:is-draggable="!block.meta.fixed">
        <Block :block="block"></Block>
        <div class="actions">
          <button @click="handleEditBlockButtonClick(block)">Edit</button>
          <button @click="handleRemoveBlockButtonClick(block)">X</button>
        </div>
      </grid-item>
    </grid-layout>
  </div>
  <div class="builder-grid" v-else>
    <h4>No block added yet.</h4>
  </div>
</template>
<script>

/* eslint-disable-next-line */
import VueGridLayout from 'vue-grid-layout'
import { mapState, mapActions } from 'vuex'
import Block from '@/components/block/Block'

export default {
  name: 'BuilderGrid',
  components: {
    Block,
  },
  computed: {
    ...mapState({
      layout: state => state.builder.layout,
      draggable: state => state.builder.draggable,
      resizable: state => state.builder.resizable,
      index: state => state.builder.index,
      mobilePreview: state => state.builder.mobilePreview,
      colNum: state => state.builder.colNum,
    }),
  },

  methods: {
    ...mapActions('builder', ['handleEditBlockButtonClick', 'handleRemoveBlockButtonClick']),
  },
}
</script>

<style lang="scss" scoped>
.actions {
  position: absolute;
  right: 0;
  top: 0;
}

.builder-grid {
  width: 100%;

  &.mobile {
    width: 320px;
    margin: 0 auto;
  }
}
.vue-grid-item {
  border: 1px solid #ccc;
  padding: 10px;
}

/* vue-grid-layout CSS
 * ================================================== */
.layoutJSON {
}

.eventsJSON {
}

.columns {
}

.vue-resizable-handle {
}

.vue-grid-item:not(.vue-grid-placeholder) {
}

.vue-grid-item.resizing {
}

.vue-grid-item.static {
}

.vue-grid-item .text {
}

.vue-grid-item .no-drag {
}

.vue-grid-item .minMax {
}

.vue-grid-item .add {
}

.vue-draggable-handle {
}
</style>
