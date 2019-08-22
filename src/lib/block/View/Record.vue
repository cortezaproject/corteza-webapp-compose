<template>
  <div v-if="record && options" class="record">
    <div v-for="(field, index) in fields"
         class="field"
         :key="index">
      <label>{{ field.label || field.name }}</label>
      <div v-if="field.canReadRecordValue">
        <field-viewer :namespace="namespace"
                      :field="field"
                      :record="record"
                      value-only />
      </div>
      <i v-else>{{ $t('field.noPermission') }}</i>
    </div>
  </div>
  <div v-else>{{ $t('block.record.preview.blockNoRecord') }}</div>
</template>
<script>
import base from './base'
import FieldViewer from 'corteza-webapp-compose/src/lib/field/Viewer'
import Exporter from 'corteza-webapp-compose/src/components/Public/Record/Exporter'

export default {
  components: {
    FieldViewer,
    Exporter,
  },

  extends: base,

  computed: {
    fields () {
      return this.module.filterFields(this.options.fields)
    },
  },
}
</script>
<style scoped lang="scss">

.record {
  .field {
    margin-bottom: 10px;

    label {
      font-weight: 900;
      display: block;
      font-size: 12px;
      font-family: $bold;
    }

    div {
      min-width: 200px;
      display: inline-block;
    }

    i {
      color: $secondary;
    }
  }
}
</style>
