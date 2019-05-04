<template>
  <div v-if="record && options" class="record">
    <div v-for="(field, index) in fields"
         class="field"
         :key="index">
      <label>{{ $t(field.label) || field.name }}</label>
      <div>
        <field-viewer :namespace="namespace"
                      :field="field"
                      :record="record"
                      value-only />
      </div>
    </div>
  </div>
  <div v-else>{{ $t('block.record.preview.blockNoRecord') }}</div>
</template>
<script>
import base from './base'
import FieldViewer from '@/lib/field/Viewer'

export default {
  components: {
    FieldViewer,
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
@import "@/assets/sass/_0.declare.scss";

.record {
  .field {
    margin-bottom: 10px;

    label {
      font-weight: 900;
      display: block;
      font-size: 12px;
      font-family: $crustheavy;
    }

    div {
      min-width: 200px;
      display: inline-block;
    }
  }
}
</style>
