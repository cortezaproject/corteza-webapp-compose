<template>
  <div
    class="d-flex w-100"
  >
    <namespace-sidebar
      v-if="namespaces.length"
      :namespaces="namespaces"
    />
    <router-view
      v-if="loaded"
    />
  </div>
</template>

<script>
import NamespaceSidebar from 'corteza-webapp-compose/src/components/Namespaces/NamespaceSidebar'

export default {
  components: {
    NamespaceSidebar,
  },

  data () {
    return {
      query: '',

      loaded: false,
      namespaces: [],
    }
  },

  created () {
    this.$store.dispatch('namespace/load', { force: true }).then(namespaces => {
      this.namespaces = namespaces
      this.loaded = true
    }).catch(this.toastErrorHandler(this.$t('notification.general.composeAccessNotAllowed')))
  },
}
</script>
