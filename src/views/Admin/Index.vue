<template>
  <div class="centering-wrap inactive-area">
    <admin-header></admin-header>
    <router-view :namespace="namespace" />
  </div>
</template>

<script>
import AdminHeader from '@/components/Admin/Header'
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
}
</script>
