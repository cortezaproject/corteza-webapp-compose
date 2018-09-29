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
          <input type="text" id="api" name="api" v-model="baseUrl" required :disabled="processing" autocomplete="baseUrl" />
        </div>

        <div class="input-wrap">
          <label for="name">Name</label>
          <input type="text" id="name" name="name" v-model="name" required  :disabled="processing" autocomplete="name" />
        </div>

        <div class="input-wrap">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" v-model="email" required  :disabled="processing" autocomplete="email" />
        </div>

        <div class="input-wrap">
          <label for="username">Username</label>
          <input type="text" id="username" name="username" v-model="username" required  :disabled="processing" autocomplete="username" />
        </div>

        <div class="input-wrap">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" v-model="password" required :disabled="processing" autocomplete="password" />
        </div>

        <div class="button-wrap">
          <button type="submit" class="center-button" :disabled="processing">Sign up</button>
        </div>

        <div class="form-footer-info">
          Already have an account? <router-link :to="{name:'signin'}" class="form-link">Sign in now.</router-link> It's free.
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

// import { store, authenticate, baseUrl, isAuthenticated } from '@/api/crust-sam/auth'

export default {
  data () {
    return {
      baseUrl: '',
      name: '',
      email: '',
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
      createAccount: 'auth/create',
    }),

    onSubmit () {
      this.createAccount({
        baseUrl: this.baseUrl,
        name: this.name,
        email: this.email,
        username: this.username,
        password: this.password,
      })
    },
  },
}
</script>

<style>
 //for later :
 //@import path.resolve('/login.scss');
</style>
