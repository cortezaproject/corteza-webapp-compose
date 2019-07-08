<template>
  <div class="centering-wrap inactive-area" v-if="namespace.canManageNamespace">
    <admin-header :namespace="namespace"></admin-header>
    <router-view :namespace="namespace" />
  </div>
</template>

<script>
import AdminHeader from 'corteza-webapp-compose/src/components/Admin/Header'
export default {
  name: 'admin-root',

  components: {
    AdminHeader,
  },

  props: {
    namespace: {
      type: Object,
      required: false,
    },
  },

  mounted () {
    if (!this.namespace.canManageNamespace) {
      this.$router.push({ name: 'pages' })
    }
  },
}
</script>
