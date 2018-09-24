<template>
  <div class="iFrameWrap"><iframe
      v-for="(tab, index) in tabs" :key="index"
      style="width: 100%; height:100%; overflow-x: hidden; overflow-y: scroll;"
      class="iframeContent"
      :class="[ { active : active_tab === tab.id } ]"
      frameborder="0"
      :src="tab.src"/></div>
</template>

<script>
export default {
  name: 'PaneContent',
  props:
  {
    pane_id:
    {
      required: true,
      type: Number,
    },
    top:
    {
      required: false,
      type: String,
      default: '',
    },
    left:
    {
      required: false,
      type: String,
      default: '',
    },
    tabs: {
      required: true,
      type: Array,
    },
    active_tab:
    {
      type: Number,
      required: false,
      default: 0,
    },
  },
}
</script>

<style lang="scss">
  .iFrameWrap
  {
    margin-top:0;
    *
    {
      box-sizing: border-box;
    }
    .iframeContent
    {
      display:none;
      min-height:calc(100vh - 96px);
      &.active
      {
        display:block;
      }
    }
  }
</style>
