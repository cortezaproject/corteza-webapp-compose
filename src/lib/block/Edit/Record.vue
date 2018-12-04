<template>
  <dl>
    <component :is="'fieldText'" v-for="field in options.fields" :key="field.id" />
  </dl>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import * as Fields from './Field/loader'

export default {
  props: {
    record: {
      type: Object,
      required: false, // actually true, but we'll going to fail soft here
    },
  },

  computed: {
    recordValue () {
      return (field) => (this.record.fields.find(f => f.name === field.name) || {}).value
    },
  },

  mixins: [
    optionsPropMixin,
  ],

  components: {
    ...Fields,
  },
}
</script>
<style scoped lang="scss">
div { background-color: yellow; }
</style>
