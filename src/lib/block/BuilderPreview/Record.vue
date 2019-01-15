<template>
  <div v-if="options">
    <p v-if="module">Single record block, displaying fields ({{ selectedFields }}) from module <code>{{ module.name || 'Untitled' }}</code></p>
  </div>
  <div v-else>Can not render this block without a record</div>
</template>
<script>
import base from './base'

export default {
  extends: base,
  computed: {
    module () {
      return this.$store.getters['module/getByID'](this.options.moduleID)
    },

    selectedFields () {
      return this.options.fields.filter(f => !!f).map(f => f.name).join(', ')
    },
  },
}
</script>
