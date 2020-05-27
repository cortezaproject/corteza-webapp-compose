<template>
  <report-edit
    :report.sync="editReport"
    :modules="modules"
    :dimension-field-kind="['Select']"
    :supported-metrics="1"
    un-skippable
  >
    <template #dimension-options="{ dimension, field }">
      <picker
        v-if="renderPicker(field)"
        :items="makeOptions(field, dimension)"
        :selected.sync="dimension.meta.fields"
        key-prop="value"
        class="cursor-pointer"
      >
        <template #item="{ item }">
          <div>
            <span class="ml-1">
              {{ item.value }}
            </span>
          </div>
        </template>
      </picker>
    </template>
  </report-edit>
</template>

<script>
import ReportEdit from './ReportEdit'
import Picker from 'corteza-webapp-compose/src/components/Common/ItemPicker'
import base from './base'

export default {
  components: {
    ReportEdit,
    Picker,
  },

  extends: base,

  methods: {
    renderPicker (field) {
      return field && field.kind === 'Select' && field.options.options
    },

    makeOptions (field, dimension) {
      const ff = dimension.meta.fields || []
      return field.options.options.map(({ text, value }) => ({
        text,
        value,
        color: (ff.find(b => value === b.value) || {}).color,
      }))
    },
  },
}
</script>

<style scoped lang="scss">
  .cursor-pointer {
    cursor: pointer;
  }
</style>
