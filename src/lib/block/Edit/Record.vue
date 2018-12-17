<template>
  <div>
    <field-editor
      v-for="field in fields"
      :record.sync="record"
      :key="field.id"
      :field="field" />
  </div>
</template>
<script>
import optionsPropMixin from './mixins/optionsProp'
import FieldEditor from '@/lib/field/Editor'

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
      return this.module.filterFields(this.options.fields)
    },
  },

  mixins: [
    optionsPropMixin,
  ],

  components: {
    FieldEditor,
  },
}
</script>
<style scoped lang="scss">
</style>
