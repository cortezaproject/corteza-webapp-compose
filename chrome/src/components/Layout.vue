<template>
  <div class="layout" v-if="false && 1 === panes.items.length">
    <!-- only one item -->
    <div v-for="(pane, paneid) in panes.items"
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
  <div class="layout" v-else>
    <!-- multiple panels -->
    <multipane
      layout= "horizontal"
      style= "height:100%">
      <div
        class="pane"
        :style="{ height: '50%' }">
        <multipane
          layout="vertical"
          style="height:100%;width:100%;">
          <div
            class="pane pane1"
            :style="{ width:'50%' }"
            style="background-color:#ddeeff;">
            <TabBar
              :pane_id="0"
              :tabs="panes.items[0].tabs"
              :active_tab="panes.items[0].active"
              top="0"
              left="0"
              :showapps="false"
              v-on:changeActive="activateTab" />
            <PaneContent
              :pane_id="0"
              :tabs="panes.items[0].tabs"
              :active_tab="panes.items[0].active" />
          </div>
          <cMultipaneResizer />
          <div
            class="pane"
            :style="{ flexGrow: '1' }"
            style="background-color:#ffeedd">
            <TabBar
              :pane_id="1"
              :tabs="panes.items[1].tabs"
              :active_tab="panes.items[1].active"
              top="0"
              left="0"
              :showapps="false"
              v-on:changeActive="activateTab" />
            <PaneContent
              :pane_id="1"
              :tabs="panes.items[1].tabs"
              :active_tab="panes.items[1].active" />
          </div>
        </multipane>
      </div>
      <cMultipaneResizer dir="h" />
      <div
        class="pane"
        :style="{ flexGrow: '1', flexBasis: '0' }"
        style="background-color:#eeddff">
          <TabBar
            :pane_id="2"
            :tabs="panes.items[2].tabs"
            :active_tab="panes.items[2].active"
            top="0"
            left="0"
            :showapps="false"
            v-on:changeActive="activateTab" />
          <PaneContent
            :pane_id="2"
            :tabs="panes.items[2].tabs"
            :active_tab="panes.items[2].active" />
      </div>
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
        /* one simple panel, 3 tabs
        disposition: [0],
        items:
        [
          {
            id: 0,
            active: 2,
            tabs:
            [
              {
                id: 0,
                title: 'Chat',
                src: 'https://latest.rustbucket.io',
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
        ],
        /* */
        //* 2 panels, seperated by columns first
        disposition: [1, 0],
        items:
        [
          {
            active: 0,
            tabs:
            [
              {
                id: 0,
                title: 'Chat',
                src: 'https://latest.rustbucket.io',
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
            active: 1,
            tabs:
            [
              {
                id: 0,
                title: 'Chat',
                src: 'https://latest.rustbucket.io',
              },
              {
                id: 1,
                title: 'Search',
                src: 'https://google.come',
              },
            ],
          },
          {
            active: 0,
            tabs:
            [
              {
                id: 0,
                title: 'Chat',
                src: 'https://latest.rustbucket.io',
              },
              {
                id: 1,
                title: 'Example',
                src: 'https://www.example.com/',
              },
            ],
          },
        ],
        /* */
        /*
        columns:
        [
          {
            class: 'fl',
            rows:
            [
              { 'component': Panel, 'link': 'https://latest.rustbucket.io' },
              { 'component': Panel, 'link': 'https://latest.rustbucket.io' },
            ],
          },
          {
            class: 'fr',
            rows:
            [
              { 'component': Panel, 'link': 'https://latest.rustbucket.io' },
            ],
          },
        ],
        */
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

<style scoped lang="scss">
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
    iframe
    {
      pointer-events:none;
    }
  }
}
.layout-h .pane
{

}
.layout-v .pane
{
  height:100% !important;
}
</style>
