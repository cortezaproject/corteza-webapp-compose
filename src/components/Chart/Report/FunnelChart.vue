<template>
  <report-edit
    :report.sync="editReport"
    :modules="modules"
    :dimension-field-kind="['Select']"
    :supported-metrics="1"
    un-skippable
  >
    <template #dimension-options="{ dimension, field }">
      <field-picker
        v-if="renderPicker(field)"
        :module="makeOptions(field, dimension)"
        :fields.sync="dimension.meta.fields"
        disable-system-fields
        class="d-flex flex-column"
      />
    </template>
  </report-edit>
</template>

<script>
import ReportEdit from './ReportEdit'
import FieldPicker from 'corteza-webapp-compose/src/components/Common/FieldPicker'
import base from './base'

export default {
  components: {
    ReportEdit,
    FieldPicker,
  },

  extends: base,

  methods: {
    renderPicker (field) {
      return field && field.kind === 'Select' && field.options.options
    },

    makeOptions (field, dimension) {
      const ff = dimension.meta.fields || []
      return {
        ...field.options.options.map(({ text, value }) => ({
          text,
          value,
          color: (ff.find(b => value === b.value) || {}).color,
        })),
      }
    },
  },
}
</script>

<style scoped lang="scss">
  .cursor-pointer {
    cursor: pointer;
  }
</style>
