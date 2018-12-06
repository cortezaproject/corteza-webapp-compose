<template>
  <div v-if="record && options" >
    <field-viewer
      v-for="(field, index) in fields"
      :key="index"
      :field="field"
      :record="record || {}"></field-viewer>
  </div>
  <div v-else>Can not render this block without a record</div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import FieldViewer from '@/lib/field/Viewer'

export default {
  props: {
    module: {
      type: Object,
      required: true,
    },

    record: {
      type: Object,
      required: false, // actually true, but we'll going to fail soft here
    },
  },

  computed: {
    fields () {
      const whitelist = this.options.fields.map(f => f.name)
      return this.module.fields.filter(f => whitelist.indexOf(f.name) > -1)
    },
  },

  mixins: [
    optionsPropMixin,
  ],

  components: {
    FieldViewer,
  },
}
</script>
