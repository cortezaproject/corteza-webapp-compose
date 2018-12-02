<template>
  <div v-if="options">
    <div v-for="field in options.fields" :key="field.id">
      <FieldTypes v-bind:is="mapFieldKind(field.kind)" :field.sync="field"></FieldTypes>
    </div>
  </div>
  <div v-else>Can not render this block without a record</div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import * as FieldTypes from './fields/loader'

export default {
  props: {
    record: {
      type: Object,
      required: false, // actually true, but we'll going to fail soft here
    },
  },

  computed: {
    recordValue () {
      return field =>
        (this.record.fields.find(f => f.name === field.name) || {}).value
    },
  },

  methods: {
    mapFieldKind (kind) {
      return 'field' + kind
    },
  },

  mixins: [optionsPropMixin],

  components: {
    ...FieldTypes,
  },
}
</script>
