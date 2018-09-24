<template>
  <div class="workspace">
    <Header :user="user" />
    <Layout :user="user" :panes="panes" />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Layout from '@/components/Layout.vue'
// import Panel from '@/components/Panel.vue'

export default {
  components:
  {
    'Header': Header,
    'Layout': Layout,
  },
  data ()
  {
    return {
      user: {
        id: '01234567891',
        has_notifications: false,
        username: 'BetaUser',
        avatar: '1',
      },
      panes:
      {
        //* one simple panel, 2 tabs
        items:
        [
          {
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
        /* 2 panels, seperated by columns first
        items: 2,
        disposition: 'cols-first',
        columns:
        [
          {
            rows:
            [
              { 'component': Panel, 'link': 'https://latest.rustbucket.io' },
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
}
</script>

<style>
*
{
  margin:0;
  padding:0;
}
</style>
