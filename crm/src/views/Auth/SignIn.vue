<template>
  <div class="signIn login-process centered">
    <div class="app-form-wrap shaded">
      <div class="crust-window-header">
        <div class="crust_main-header_title-wrap">
          <strong class="crust_main-header_title">Crust</strong>
          <span class="crust_main-header_title__pf">platform</span>
        </div>
      </div>
      <form v-on:submit.prevent="onSubmit" class="large-form">
        <div class="error" v-if="authError">
          {{ authError }}
        </div>

        <div class="input-wrap">
          <label for="api">Crust server API</label>
          <input type="text" name="api" id="api" v-model="baseUrl" required :disabled="processing" autocomplete="baseUrl" />
        </div>

        <div class="input-wrap">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" v-model="username" required  :disabled="processing" autocomplete="username" />
        </div>

        <div class="input-wrap">
          <label for="password" class="with-note float-left">Password</label>
          <span class="form-link-wrap float-right"><a class="form-link" href="/url-for-lost-password">Lost-Password ?</a></span>
          <input type="password" id="password" name="password" v-model="password" required :disabled="processing" autocomplete="password" />
        </div>

        <div class="button-wrap">
          <button class="validate center-button" type="submit" :disabled="processing">Sign in</button>
        </div>

        <div class="form-footer-info">
          No account yet? <router-link :to="{name:'signup'}" class="form-link">Sign up now.</router-link> It's free.
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data () {
    return {
      baseUrl: '',
      username: '',
      password: '',
    }
  },

  computed: {
    ...mapGetters({
      orgBaseUrl: 'auth/baseUrl',
      authError: 'auth/error',
      processing: 'auth/processing',
      isAuthenticated: 'auth/isAuthenticated',
    }),
  },

  mounted () {
    if (this.isAuthenticated) {
      this.$router.push('/')
    }

    // Set current/default base url from the store
    this.baseUrl = this.orgBaseUrl
  },

  watch: {
    isAuthenticated: function (isAuthenticated) {
      if (isAuthenticated) {
        this.$router.push('/')
      }
    },
  },

  methods: {
    ...mapActions({
      authenticate: 'auth/authenticate',
    }),

    onSubmit () {
      this.authenticate({ baseUrl: this.baseUrl, username: this.username, password: this.password })
    },
  },
}
</script>

<style scoped>
</style>
