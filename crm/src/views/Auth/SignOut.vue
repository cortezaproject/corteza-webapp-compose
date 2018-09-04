<template>
  <p>Signing out...</p>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('auth/clear')
    this.$router.push('/')
  }
}
</script>