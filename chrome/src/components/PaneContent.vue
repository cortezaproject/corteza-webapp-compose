<template>
  <div class="iFrameWrap">
    <div class="iFrameContainer">
      <div
        v-for="(tab, index) in tabs" :key="index"
        style="width: 100%; height:100%; overflow-x: hidden; overflow-y: auto;"
        :class="[ { active : active_tab === tab.id } ]"
        class="iframeContent"
      >
      <br /><br /><h1> tab : {{ index }} </h1>

      contenu : {{ tab.src }}
      </div>
      <!-- iframe
      v-for="(tab, index) in tabs" :key="index"
      style="width: 100%; height:100%; overflow-x: hidden; overflow-y: scroll;"
      class="iframeContent"
      :class="[ { active : active_tab === tab.id } ]"
      frameborder="0"
      :src="tab.src"/ -->
    </div>
  </div>
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
    height:100%;
    *
    {
      box-sizing: border-box;
    }
    .iFrameContainer
    {
      height:100%;
      width:100%;
      background-color:aliceblue;
    }
    .iframeContent
    {
      display:none;
      &.active
      {
        display:block;
      }
    }
  }
</style>
