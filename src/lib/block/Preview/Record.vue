<template>
  <p>Single record block, displaying fields ({{ selectedFields }}) from module <code>{{ module.name || 'Untitled' }}</code></p>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import moduleLoaderMixin from './mixins/moduleLoader'

export default {
  computed: {
    selectedFields () {
      return this.options.fields.filter(f => !!f).map(f => f.name).join(', ')
    },
  },

  mixins: [
    optionsPropMixin,
    moduleLoaderMixin,
  ],
}
</script>
