<template>
  <div class="layout">
    <multipane
      :layout="panes.disposition.type==='colfirst'?'vertical':'horizontal'"
      style="height:100%;width:100%;">
      <template
        v-for="(pane, paneindex) in panes.items">
        <div
          class="pane"
          :class="[ { last : (panes.items.length - 1 === paneindex) } ]"
          :style="{ width: (100/panes.items.length)+'%' }"
          style="background-color:#ddeeff;"
          :key="paneindex">
          <TabBar
            :pane_id="paneindex"
            :tabs="pane.tabs"
            :active_tab="pane.active"
            top="0"
            left="0"
            :showapps="false"
            v-on:changeActive="activateTab" />
          <PaneContent
            :pane_id="paneindex"
            :tabs="pane.tabs"
            :active_tab="pane.active" />
        </div>
        <cMultipaneResizer v-if="panes.items.length - 1 !== paneindex"  :key="paneindex" />
      </template>
    </multipane>
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
  data ()
  {
    return {
      panes:
      {
        // how panels are positionnned
        disposition:
        {
          type: 'colfirst',
          // 2 dimensionnal array,
          // first split is vertical if type:colfirst
          // first split is horizontal if type:rowfirst
          itempos: [ [ 0, 1 ], 2 ],
        },
        // items
        items:
        [
          {
            active: 0,
            tabs:
            [
              {
                id: 0,
                title: 'BDM',
                src: 'https://www.blogdumoderateur.com/',
              },
              {
                id: 1,
                title: 'Neuromancer',
                src: 'https://www.youtube.com/embed/2bjyw1Swr9A',
              },
              {
                id: 2,
                title: 'Holidays',
                src: 'https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d5548694.956216767!2d1.9195935488340492!3d47.2298136496854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m5!1s0x476531f5969886d1%3A0x400f81c823fec20!2sLjubljana%2C+Slovenia!3m2!1d46.056946499999995!2d14.505751499999999!4m5!1s0x480ede2fa7d69085%3A0x40ca5cd36e4ab30!2sRennes!3m2!1d48.117266!2d-1.6777925999999999!5e0!3m2!1sen!2sfr!4v1537822098803',
              },
            ],
          },
          {
            active: 0,
            tabs:
            [
              {
                id: 0,
                title: 'Phone',
                src: 'https://appear.in/crust',
              },
              {
                id: 1,
                title: 'Chat',
                src: 'https://latest.rustbucket.io',
              },
            ],
          },
          {
            active: 0,
            tabs:
            [
              {
                id: 0,
                title: 'Example 1',
                src: 'https://www.example.com/',
              },
              {
                id: 1,
                title: 'Example 2',
                src: 'https://www.example.com/',
              },
            ],
          },
        ],
      },
    }
  },
  props:
  {
  },
  methods:
  {
    activateTab: function (newActiveTab)
    {
      console.log('newActiveTab ' + newActiveTab.id + ' in pane ' + newActiveTab.pane)
      this.panes.items[newActiveTab.pane].active = newActiveTab.id
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
@import '@/assets/sass/_0.declare.scss';
.layout
{
  position:absolute;
  top:96px;
  height:calc(100vh - 96px);
  max-height:100vh;
  width:100vw;
  overflow:hidden;
  background-color:black;
  .is-resizing
  {
    .iFrameContainer
    {
      border:solid 2px $appblue;
      pointer-events:none;
    }
  }
}
.pane.last
{
  flex-grow:1;
}
.layout-h .pane
{
  height:auto;
}
.layout-v .pane
{
  height:100% !important;
}
</style>
