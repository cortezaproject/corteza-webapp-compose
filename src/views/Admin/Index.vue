<template>
  <div class="d-flex flex-column w-100 vh-100" v-if="namespace.canManageNamespace">
    <admin-header
      :namespace="namespace"
    />
    <router-view
      class="flex-grow-1 overflow-auto"
      :namespace="namespace"
    />
    <portal-target
      name="admin-toolbar"
    />
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
