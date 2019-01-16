<template>
  <div class="centering-wrap inactive-area" v-if="isAuthenticated">
    <div class="alert-holder">
      <b-alert v-for="(a,i) in alerts"
               :variant=" a.variant || 'info'"
               :key="'alert:'+i"
               :show="a.countdown"
               dismissible
               @dismiss-count-down="a.countdown=$event"
               @dismissed="alerts.splice(i, 0)">{{ a.message }}</b-alert>
    </div>
    <router-view v-if="loaded" />
    <div class="loader">
      <img :src="logo" />
    </div>
  </div>
</template>

<script>
import auth from '@/mixins/auth'

export default {
  data () {
    return {
      logo: require('@/assets/images/crust-logo-with-tagline.png'),
      loaded: false,
      alerts: [], // { variant: 'info', message: 'foo' },
    }
  },

  created () {
    this.handleAlert((alert) => this.alerts.push(alert))

    Promise.all([
      // Preload all data we need.
      this.$store.dispatch('module/load'),
      this.$store.dispatch('chart/load'),
      this.$store.dispatch('page/load'),
      this.$store.dispatch('trigger/load'),
    ]).then(() => {
      this.loaded = true
    })
  },

  mixins: [auth],
}
</script>
<style lang="scss" scoped>
  @import "@/assets/sass/btns.scss";
  @import "@/assets/sass/_0.declare.scss";

  .alert-holder {
    position: absolute;
    width: 100%;
    top: 55px;

    .alert {
      z-index: 1;
      box-shadow: 0 0 2px 0 rgba($appgrey, 0.75);
    }
  }

  @keyframes flickerAnimation {
    0%   { opacity:.6; }
    50%  { opacity:.1; }
    100% { opacity:.6; }
  }

  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    img {
      align-self: center;
      opacity:.7;
      animation: flickerAnimation 3s infinite;
    }
  }
</style>
