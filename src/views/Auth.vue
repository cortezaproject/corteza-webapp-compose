<template>
  <main>
    <h1>Hello Crust developer.</h1>

    <p><b>It looks like you need to login</b></p>

    <p>In a production environment, you would be redirected to <code>/auth</code> and be presented with the login UI.</p>

    <p>
      Due to some limitations in the dev env, please copy your JWT manually. Go to the logged in instance and
      find it in your local-storage or by running <code>localStorage.getItem('auth.jwt')</code> in the browser
      console and paste it to the input box below.
    </p>

    <p>
      Crust System API:<br/>
      <code>{{ backend }}</code>
    </p>

    Manage your JWT here:
    <textarea placeholder="your.jwt.string" rows="5" v-model.trim="newJWT"></textarea>
    <button @click="check" :disabled="!this.newJWT">Check & store</button> &nbsp;

    <br />
    <br />

    <span v-if="checkRsp">Response: <code>{{ checkRsp }}</code></span>

    <pre v-if="$auth.user">User data: {{ $auth.user }}</pre>

    <hr />

    <a href="/">&laquo; Back</a>
  </main>
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
      return window.CrustSystemAPI
    },
  },

  created () {
    if (process.env.NODE_ENV !== 'development') {
      // Not in development mode, move away from here
      window.location = '/auth'
    }

    this.newJWT = this.$auth.JWT
  },

  methods: {
    check () {
      this.$auth.check(this.$system, this.newJWT).then((user) => {
        this.currentUser = user
        this.checkRsp = 'Valid JWT.'
      }).catch(({ message }) => {
        this.checkRsp = message
      })
    },
  },
}
</script>
<style scoped lang="scss">

main {
  font-size: 16px;
  width: 800px;
  padding: 60px;
  position: absolute;
  text-align: left;

  textarea {
    font-size: 10px;
    width: 100%;
    font-family: monospace;
  }
}

</style>
