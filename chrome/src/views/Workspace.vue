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
                title: 'Neuromancer',
                src: 'https://www.youtube.com/embed/2bjyw1Swr9A',
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
