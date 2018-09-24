<template>
  <div class="layout">
    <div
      v-if="1===panes.items.length"
      v-for="(pane, paneid) in panes.items"
      :key="paneid">
      <TabBar
        :pane_id="paneid"
        :tabs="pane.tabs"
        :active_tab="pane.active"
        top="96px"
        left="-1px"
        :showapps="false"
        v-on:changeActive="activateTab" />
      <PaneContent
        :pane_id="paneid"
        :tabs="pane.tabs"
        :active_tab="pane.active"
        top="96px" />
    </div>
  </div>
</template>

<script>
import { Multipane } from 'vue-multipane'
import cMultipaneResizer from '@/components/cMultipaneResizer.vue'
import TabBar from '@/components/TabBar.vue'
import PaneContent from '@/components/PaneContent.vue'

export default
{
  name: 'Layout',
  props:
  {
    panes:
    {
      type: Object,
      required: true,
    },
  },
  methods:
  {
    activateTab: function (newActiveTab)
    {
      console.log('activateTab ' + newActiveTab)
      this.panes.items[0].active = newActiveTab
    },
  },
  components:
  {
    Multipane,
    cMultipaneResizer,
    TabBar,
    PaneContent,
  },
}
</script>

<style lang="scss">
.layout
{
  position:fixed;
  top:96px;
  bottom:0;
  left:0;
  right:0;
  background-color:rgb(177, 165, 165);
}
</style>
