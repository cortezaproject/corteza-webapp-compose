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
  </div>
</template>

<script>
import auth from '@/mixins/auth'
export default {
  data () {
    return {
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
</style>
