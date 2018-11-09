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
export default {
  data () {
    return {
      oidc: this.$system.baseURL() + '/oidc',
    }
  },
  mounted () {
    this.$system.authCheck().then((check) => {
      this.$store.commit('auth/setUser', check.user)
      this.$router.push({ name: 'root' })
    }).catch((error) => {
      this.$store.commit('clear')
      console.error(error)
    }).finally(() => {
      this.$store.commit('auth/loaded', true)
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
