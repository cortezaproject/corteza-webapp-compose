<template>
  <div v-if="options">
    <p v-if="module">Single record block, displaying fields ({{ selectedFields }}) from module <code>{{ module.name || 'Untitled' }}</code></p>
  </div>
  <div v-else>Can not render this block without a record</div>
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

  methods: {
    mapFieldKind (kind) {
      return 'field' + kind
    },
  },

  mixins: [
    optionsPropMixin,
    moduleLoaderMixin,
  ],
}
</script>
