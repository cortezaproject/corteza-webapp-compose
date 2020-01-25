<template>
  <b-tab :title="$t('block.record.label')">
    <fieldset class="form-group">
      <label>{{ $t('block.general.module') }}</label>
      <input v-if="module" class="form-control" type="text" v-model="module.name" readonly>
    </fieldset>
    <field-picker v-if="module" :module="module" :fields.sync="options.fields" />
  </b-tab>
</template>
<script>
import base from './base'
import FieldPicker from 'corteza-webapp-compose/src/components/Common/Module/FieldPicker'

export default {
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
