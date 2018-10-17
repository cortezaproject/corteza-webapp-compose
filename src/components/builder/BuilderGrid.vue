<template>
  <div v-if="layout.length >= 1" v-bind:class="{ 'mobile': mobilePreview }" class="builder-grid">
    <grid-layout :layout="layout" :col-num="colNum" :row-height="rowHeight" :is-draggable="draggable" :is-resizable="resizable" :vertical-compact="true" :use-css-transforms="true">
      <grid-item v-for="item in layout" v-bind:key="item.i" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i" v-bind:is-draggable="!item.meta.fixed">
        <h4>ID: {{ item.i }}</h4>
        <div class="actions">
          <h4>Actions:</h4>
          <button @click="handleRemoveBlockButtonClick(item)">Remove block</button>
          <button @click="handleEditBlockButtonClick(item)">Edit block</button>
        </div>
        <div class="data">
          {{item.data}}
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
import { mapState, mapMutations, mapActions } from 'vuex'

export default {
  name: 'BuilderGrid',

  computed: {
    ...mapState({
      layout: state => state.builder.layout,
      draggable: state => state.builder.draggable,
      resizable: state => state.builder.resizable,
      index: state => state.builder.index,
      colNum: state => state.builder.colNum,
      rowHeight: state => state.builder.rowHeight,
      mobilePreview: state => state.builder.mobilePreview,
    }),
  },

  methods: {
    ...mapMutations('builder', ['handleRemoveBlockButtonClick']),
    ...mapActions('builder', ['handleEditBlockButtonClick']),
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/shared";

h4 {
  margin: 0.2em 0 0.4em 0;
}

.builder-grid {
  width: 100%;
  background: rgb(235, 235, 235);

  &.mobile {
    width: 320px;
    margin: 0 auto;
  }
}

/* vue-grid-layout CSS
 * ================================================== */
.layoutJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
}

.eventsJSON {
  background: #ddd;
  border: 1px solid black;
  margin-top: 10px;
  padding: 10px;
  height: 100px;
  overflow-y: scroll;
}

.columns {
  -moz-columns: 120px;
  -webkit-columns: 120px;
  columns: 120px;
}

.vue-resizable-handle {
  z-index: 5000;
  position: absolute;
  width: 20px;
  height: 20px;
  bottom: 0;
  right: 0;
  background: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=");
  background-position: bottom right;
  padding: 0 3px 3px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: se-resize;
}

.vue-grid-item:not(.vue-grid-placeholder) {
  background: #ccc;
  border: 1px solid black;
}

.vue-grid-item.resizing {
  opacity: 0.9;
}

.vue-grid-item.static {
  background: #cce;
}

.vue-grid-item .text {
  font-size: 24px;
  text-align: center;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  height: 100%;
  width: 100%;
}

.vue-grid-item .no-drag {
  height: 100%;
  width: 100%;
}

.vue-grid-item .minMax {
  font-size: 12px;
}

.vue-grid-item .add {
  cursor: pointer;
}

.vue-draggable-handle {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 0;
  left: 0;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
    no-repeat;
  background-position: bottom right;
  padding: 0 8px 8px 0;
  background-repeat: no-repeat;
  background-origin: content-box;
  box-sizing: border-box;
  cursor: pointer;
}
</style>
