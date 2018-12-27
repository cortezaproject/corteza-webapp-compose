<template>
  <div v-if="record && options" class="record">
    <div v-for="(field, index) in fields"
         class="field"
         :key="index">
      <label>{{ field.label || field.name }}</label>
      <div>
        <field-viewer
          :field="field"
          value-only
          :record="record || {}"></field-viewer>
      </div>
    </div>
  </div>
  <div v-else>Can not render this block without a record</div>
</template>
<script>
import base from './base'
import FieldViewer from '@/lib/field/Viewer'

export default {
  extends: base,

  computed: {
    fields () {
      return this.module.filterFields(this.options.fields)
    },
  },

  components: {
    FieldViewer,
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
    }

    div {
      min-width: 200px;
      display: inline-block;
    }
  }
}
</style>
