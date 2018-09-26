<template>
  <div class="layout">
    <!-- first multipane level, either rows or cols function of layout type -->
    <multipane
      class="main"
      :data-nb-items="panes.disposition.itempos.length"
      :layout="panes.disposition.type==='colfirst'?'vertical':'horizontal'"
      style="height:100%;width:100%;">
      <!-- loop trhough first level -->
      <template
        v-for="(paneset, panesetindex) in panes.disposition.itempos">
        <!-- we always wrap in a div, either direct, or again a multipane -->
        <!-- single content -->
        <div
          v-if="paneset.length === 1"
          class="last pane onepane-wrapper"
          :data-nb-items="paneset.length"
          :data-structure="panes.disposition.type + '-' + panesetindex"
          :style="{ width: panes.disposition.type==='colfirst'?''+(100/panes.disposition.itempos.length)+'%':'100%', height: panes.disposition.type==='colfirst'?'100%':''+(100/panes.disposition.itempos.length)+'%' }"
          :key="panesetindex">
          <TabBar
            :pane_id="paneset[0]"
            :tabs="panes.items[paneset[0]].tabs"
            :active_tab="panes.items[paneset[0]].active"
            top="0"
            left="0"
            :showapps="false"
            v-on:changeActive="activateTab" />
          <PaneContent
            :pane_id="pane_id"
            :tabs="panes.items[paneset[0]].tabs"
            :active_tab="panes.items[paneset[0]].active"
            class="pane-content" />
        </div>
        <!-- subpanes -->
        <div
          v-else
          class="pane subpane-wrapper"
          :style="{ width: panes.disposition.type==='colfirst'?''+(100/panes.disposition.itempos.length)+'%':'100%', height: panes.disposition.type==='colfirst'?'100%':''+(100/panes.disposition.itempos.length)+'%' }"
          :data-nb-items="paneset.length"
          :data-structure="panes.disposition.type + '-' + panesetindex"
          :key="panesetindex">
          <multipane
            :style="{ height:'100%', width:'100%' }"
            :layout="panes.disposition.type!=='colfirst'?'vertical':'horizontal'">
            <!-- loop through second level -->
            <template
              v-for="(pane_id, panesubsetindex) in paneset">
              <div
                class="pane"
                :class="[ { last : (paneset.length - 1 === panesubsetindex) } ]"
                :style="{ width: panes.disposition.type!=='colfirst'?''+(100/paneset.length)+'%':'100%', height: panes.disposition.type!=='colfirst'?'100%':''+(100/paneset.length)+'%' }"
                :key="panesubsetindex">
                  <TabBar
                    :pane_id="pane_id"
                    :tabs="panes.items[pane_id].tabs"
                    :active_tab="panes.items[pane_id].active"
                    top="0"
                    left="0"
                    :showapps="false"
                    v-on:changeActive="activateTab" />
                  <PaneContent
                    :pane_id="pane_id"
                    :tabs="panes.items[pane_id].tabs"
                    :active_tab="panes.items[pane_id].active"
                    class="pane-content" />
              </div>
              <cMultipaneResizer
                v-if="paneset.length - 1 !== panesubsetindex"
                :key="panesubsetindex"
                :dir="panes.disposition.type==='colfirst'?'h':'v'" />
            </template>
          </multipane>
        </div>
        <!-- if not last paneset add resiser between elements -->
        <cMultipaneResizer
          v-if="panes.disposition.itempos.length - 1 !== panesetindex"
          :dir="panes.disposition.type==='colfirst'?'v':'h'"
          :key="panesetindex" />
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
          itempos: [ [ 0, 1 ], [ 2 ] ],
          // single vue should be :
          // itempos: [ [ 0 ] ],
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

<!-- don't scope this ! -->
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
      iframe
      {
        pointer-events:none;
      }
    }
  }
}
.pane.last
{
  flex-grow:1;
}
.layout-h > .pane
{
  width:100% !important;
}
.layout-v > .pane
{
  height:100% !important;
  &.last
  {
    width:auto!important;
  }
}
</style>
