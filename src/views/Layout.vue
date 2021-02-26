<template>
  <div class="d-flex flex-column w-100 vh-100">
    <div class="alert-holder">
      <b-alert
        v-for="(a,i) in alerts"
        :variant=" a.variant || 'info'"
        :key="'alert:'+i"
        :show="a.countdown"
        dismissible
        @dismiss-count-down="a.countdown=$event"
        @dismissed="alerts.splice(i, 0)"
      >
        {{ a.message }}
      </b-alert>
    </div>
    <main class="w-100 flex-grow">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  data () {
    return {
      alerts: [], // { variant: 'info', message: 'foo' },
    }
  },

  created () {
    this.handleAlert((alert) => this.alerts.push(alert))
  },

  beforeDestroy () {
    this.$root.$off('alert')
  },
}
</script>
