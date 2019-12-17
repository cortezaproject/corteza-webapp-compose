<template>
  <b-container
    class="p-2"
  >
    <b-row>
      <b-col>
        <h1>
          Hello Crust developer.
        </h1>

        <p>
          It looks like you need to login
        </p>

        <p>
          In a production environment, you would be redirected to
          <code>/auth</code> and be presented with the proper login UI.
        </p>

        <p>
          Due to some limitations in the dev env, please copy your JWT manually. Go to the webapp where you are logged-in
          and find it in your local-storage or by running <code>localStorage.getItem('auth.jwt')</code> in the browser
          console and paste it to the input box below.
        </p>
      </b-col>
    </b-row>

    <b-row>
      <b-col
        cols="2"
      >
        Crust System API:
      </b-col>
      <b-col
        cols="10"
      >
        <code>{{ backend }}</code>
      </b-col>
      <b-col
        cols="2"
      >
        Frontend version:
      </b-col>
      <b-col
        cols="10"
      >
        <code>{{ frontendVersion }}</code>
      </b-col>
    </b-row>

    <b-row>
      <b-col
        cols="2"
      >
        Manage your JWT here:
      </b-col>
      <b-col
        cols="10"
      >
        <textarea
          v-model.trim="newJWT"
          class="w-100"
          placeholder="your.jwt.string"
          rows="3"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="10"
        offset="2"
      >
        <b-button
          :disabled="!newJWT"
          @click="check"
        >
          Check & store
        </b-button>
        &nbsp; <code v-html="checkRsp" />
      </b-col>
    </b-row>
    <b-row v-if="$auth.user">
      <b-col
        cols="10"
        offset="2"
      >
        <pre>User data: {{ $auth.user }}</pre>
      </b-col>
    </b-row>
    <hr>
    <a href="/">&laquo; Back</a>
  </b-container>
</template>
<script>
export default {
  data () {
    return {
      checkRsp: '',
      newJWT: '',
    }
  },

  computed: {
    backend () {
      return window.SystemAPI
    },

    frontendVersion () {
      /* eslint-disable no-undef */
      return VERSION
    },
  },

  created () {
    if (process.env.NODE_ENV !== 'development') {
      // Not in development mode, move away from here
      this.$auth.open()
    }

    this.newJWT = this.$auth.JWT
  },

  methods: {
    check () {
      this.newJWT = this.newJWT.replace(/["']+/, '')
      this.checkRsp = `  ... verifying JWT`
      this.$auth.check(this.$SystemAPI, this.newJWT).then((user) => {
        let countdown = 5
        let h = setInterval(() => {
          this.checkRsp = ` &check; Valid JWT, redirecting in ${countdown} seconds`
          if (countdown === 0) {
            window.location = '/'
            clearInterval(h)
          }
          countdown--
        }, 1000)
      }).catch(({ message }) => {
        this.checkRsp = message
      })
    },
  },
}
</script>
