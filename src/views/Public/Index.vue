<template>
  <div class="centering-wrap inactive-area">
    <public-header></public-header>
    <router-view/>
  </div>
</template>

<script>
import PublicHeader from '@/components/Public/Header'
export default {
  name: 'public-root',
  components: {
    PublicHeader,
  },
}
</script>
