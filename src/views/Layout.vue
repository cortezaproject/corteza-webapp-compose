<template>
  <div class="d-flex flex-column w-100 vh-100 overflow-auto">
    <main class="w-100 flex-grow">
      <router-view />
    </main>
    <c-prompts />
    <c-permissions-modal />
  </div>
</template>
<script>
import { components } from '@cortezaproject/corteza-vue'
const { CPrompts, CPermissionsModal } = components

export default {
  components: {
    CPrompts,
    CPermissionsModal,
  },
}
</script>
