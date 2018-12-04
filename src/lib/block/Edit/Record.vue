<template>
  <div>
    <component
      v-for="field in options.fields"
      :is="kind(field)"
      :record.sync="record"
      :key="field.id"
      :field="field" />
  </div>
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

  methods: {
    kind (field) {
      return 'field-' + field.kind
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
</style>
