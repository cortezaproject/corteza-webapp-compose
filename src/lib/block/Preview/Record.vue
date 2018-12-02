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
import moduleLoaderMixin from './mixins/moduleLoader'
import * as FieldTypes from '../View/fields/loader'

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

  components: {
    ... FieldTypes,
  },
}
</script>
