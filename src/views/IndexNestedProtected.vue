<template>
  <div class="centering-wrap inactive-area" v-if="isAuthenticated">
    <router-view/>
  </div>
</template>

<script>
import auth from '@/mixins/auth'
export default {
  mixins: [auth],
}
</script>
