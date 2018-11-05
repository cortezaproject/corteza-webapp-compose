<template>
  <div class="signIn login-process centered">
    <div class="app-form-wrap shaded">
      <div class="crust-window-header">
        <div class="crust_main-header_title-wrap">
          <strong class="crust_main-header_title">Crust</strong>
          <span class="crust_main-header_title__pf">platform</span>
        </div>
      </div>
      <form class="large-form">
        Signing out...
      </form>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data () {
    return {
      oidc: this.$system.baseURL() + '/oidc',
    }
  },

  computed: {
    ...mapGetters('auth', [
      'isAuthenticated',
    ]),
  },

  methods: {
    ...mapActions('auth', [
      'clear',
    ]),
  },

  mounted () {
    if (this.isAuthenticated) {
      this.$system.authLogout().catch((err) => {
        console.error(err)
      }).finally(() => {
        this.clear()
      })
    }

    this.$router.push({ name: 'signin' })
  },
}
</script>
