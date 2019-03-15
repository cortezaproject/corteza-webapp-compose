<template>
  <div>
    <fieldset class="form-group">
      <label>{{ $t('block.recordList.module') }}</label>
      <input v-if="module" class="form-control" type="text" v-model="module.name" readonly>
    </fieldset>
    <field-selector v-if="module" :module="module" :fields.sync="o.fields" />
  </div>
</template>
<script>
import base from './base'
import FieldSelector from './inc/FieldSelector'

export default {
  name: 'Record',

  components: {
    FieldSelector,
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
