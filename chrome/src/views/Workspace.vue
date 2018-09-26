<template>
  <div class="workspace">
    <Header :user="user" />
    <Layout :user="user" />
  </div>
</template>

<script>
import Header from '@/components/Header.vue'
import Layout from '@/components/Layout.vue'

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
        avatar: '',
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
