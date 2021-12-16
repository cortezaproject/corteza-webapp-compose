<template>
  <b-tab
    :title="$t('record.label')"
  >
    <fieldset
      class="form-group"
    >
      <label>
        {{ $t('general.module') }}
      </label>
      <input
        v-if="module"
        v-model="module.name"
        class="form-control"
        type="text"
        readonly
      >
    </fieldset>

    <b-form-group
      :label="$t('module:general.fields')"
    >
      <field-picker
        v-if="module"
        :module="module"
        :fields.sync="options.fields"
        :labels="{
          searchPlaceholder: $t('field:selector.search'),
          availableFields: $t('field:selector.available'),
          selectAllFields: $t('field:selector.selectAll'),
          selectedFields: $t('field:selector.selected'),
          unselectAllFields: $t('field:selector.unselectAll'),
          systemFieldLabel: $t('field:selector.systemField'),
        }"
        max-height="max-height: 45vh;"
      />
    </b-form-group>
  </b-tab>
</template>
<script>
import base from './base'
import { components } from '@cortezaproject/corteza-vue'
const { FieldPicker } = components

export default {
  i18nOptions: {
    namespaces: 'block',
  },

  name: 'Record',

  components: {
    FieldPicker,
  },

  extends: base,
}
</script>
<style lang="scss" scoped>
  div.fields {
    display: flex;
    flex-flow: row nowrap;

    & > div {
      flex: 1;
      margin: 5px;

      button.all {
        float: right;
        font-size: 80%;
      }

      .drag-area {
        height: 150px;
        overflow-x: auto;
        border: 1px solid silver;
        padding: 2px;
      }
    }
  }
</style>
