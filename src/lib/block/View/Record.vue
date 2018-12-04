<template>
  <div v-if="record && options" >
    <component
      :is="kind(field)"
      v-for="field in options.fields"
      :value="value(field)"
      :key="field.id"
      :field="field" />
  </div>
  <div v-else>Can not render this block without a record</div>
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

    value (field) {
      if (!this.record || !this.record.fields) {
        return undefined
      }

      return (this.record.fields.find(f => f.name === field.name) || {}).value
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
