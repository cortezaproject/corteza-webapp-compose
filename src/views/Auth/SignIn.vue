<template>
  <div class="signIn login-process centered">
    <div class="app-form-wrap shaded">
      <div class="crust-window-header">
        <div class="crust_main-header_title-wrap">
          <strong class="crust_main-header_title">Crust</strong>
          <span class="crust_main-header_title__pf">platform</span>
        </div>
      </div>
      <section>
        <a :href="oidc">Login</a>
      </section>
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
      'setUser',
      'clear',
    ]),
  },

  mounted () {
    this.$system.authCheck().then((user) => {
      this.setUser(user)
      this.$router.push({ name: 'root' })
    }).catch((error) => {
      this.clear()
      console.error(error)
    })
  },
}
</script>

<style scoped>
section {
  text-align: center;
  height: 120px;
}

section a {
  padding: 50px;
  font-size: 20px;
  text-decoration: none;
}
</style>
